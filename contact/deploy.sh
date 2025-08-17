#!/bin/bash

# Script de déploiement pour l'infrastructure de formulaire de contact
# Usage: ./deploy.sh [plan|apply|destroy]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."

    # Vérifier Terraform
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform n'est pas installé"
        exit 1
    fi

    # Vérifier AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI n'est pas installé"
        exit 1
    fi

    # Vérifier les credentials AWS
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "Credentials AWS non configurés"
        exit 1
    fi

    # Vérifier le fichier terraform.tfvars
    if [ ! -f "terraform.tfvars" ]; then
        print_error "Fichier terraform.tfvars manquant"
        print_warning "Copiez terraform.tfvars.example en terraform.tfvars et modifiez les valeurs"
        exit 1
    fi

    print_success "Tous les prérequis sont satisfaits"
}

# Création du dossier lambda si nécessaire
setup_lambda_directory() {
    print_status "Préparation du dossier lambda..."

    if [ ! -d "lambda" ]; then
        mkdir -p lambda
        print_status "Dossier lambda créé"
    fi

    # Création des fichiers lambda s'ils n'existent pas
    if [ ! -f "lambda/contact_validator.py" ]; then
        print_warning "Fichier contact_validator.py manquant dans le dossier lambda"
        print_warning "Veuillez copier le code de la Lambda de validation"
    fi

    if [ ! -f "lambda/email_sender.py" ]; then
        print_warning "Fichier email_sender.py manquant dans le dossier lambda"
        print_warning "Veuillez copier le code de la Lambda d'envoi d'email"
    fi
}

# Vérification de l'email SES
check_ses_email() {
    print_status "Vérification de la configuration SES..."

    # Récupérer l'email depuis terraform.tfvars
    EMAIL=$(grep 'notification_email' terraform.tfvars | cut -d'"' -f2)

    if [ -z "$EMAIL" ]; then
        print_error "Email de notification non trouvé dans terraform.tfvars"
        exit 1
    fi

    # Vérifier si l'email est vérifié dans SES
    AWS_REGION=$(grep 'aws_region' terraform.tfvars | cut -d'"' -f2)

    if ! aws ses get-identity-verification-attributes --identities "$EMAIL" --region "$AWS_REGION" &> /dev/null; then
        print_warning "L'email $EMAIL n'est pas configuré dans SES"
        print_warning "Exécutez: aws ses verify-email-identity --email-address $EMAIL --region $AWS_REGION"
        print_warning "Puis vérifiez votre boîte mail et cliquez sur le lien de vérification"

        read -p "Voulez-vous que je configure automatiquement l'email dans SES ? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            aws ses verify-email-identity --email-address "$EMAIL" --region "$AWS_REGION"
            print_success "Demande de vérification envoyée à $EMAIL"
            print_warning "Vérifiez votre boîte mail et cliquez sur le lien avant de continuer"
        fi
    else
        print_success "Email SES vérifié"
    fi
}

# Initialisation Terraform
terraform_init() {
    print_status "Initialisation de Terraform..."
    terraform init
    print_success "Terraform initialisé"
}

# Plan Terraform
terraform_plan() {
    print_status "Génération du plan Terraform..."
    terraform plan -out=tfplan
    print_success "Plan généré (sauvegardé dans tfplan)"
}

# Apply Terraform
terraform_apply() {
    print_status "Application du plan Terraform..."
    if [ -f "tfplan" ]; then
        terraform apply tfplan
        rm -f tfplan
    else
        print_warning "Aucun plan trouvé, application directe..."
        terraform apply
    fi
    print_success "Infrastructure déployée"

    # Affichage des outputs importants
    print_status "Récupération des informations de déploiement..."
    API_URL=$(terraform output -raw api_gateway_url 2>/dev/null || echo "Non disponible")
    BUCKET_NAME=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "Non disponible")

    echo
    print_success "=== DÉPLOIEMENT TERMINÉ ==="
    echo -e "${GREEN}URL de l'API:${NC} $API_URL"
    echo -e "${GREEN}Bucket S3:${NC} $BUCKET_NAME"
    echo
    print_warning "N'oubliez pas de:"
    echo "1. Vérifier votre email dans SES si ce n'est pas déjà fait"
    echo "2. Mettre à jour l'URL de l'API dans votre composant React"
    echo "3. Configurer CORS avec votre domaine exact si nécessaire"
}

# Destroy Terraform
terraform_destroy() {
    print_warning "ATTENTION: Cette action va détruire toute l'infrastructure"
    print_warning "Toutes les données dans S3 seront perdues"
    echo
    read -p "Êtes-vous sûr de vouloir continuer ? Tapez 'yes' pour confirmer: " -r
    if [[ $REPLY == "yes" ]]; then
        print_status "Destruction de l'infrastructure..."
        terraform destroy
        print_success "Infrastructure détruite"
    else
        print_status "Destruction annulée"
    fi
}

# Affichage des outputs
show_outputs() {
    print_status "Informations de l'infrastructure actuelle:"
    terraform output
}

# Test de l'API
test_api() {
    print_status "Test de l'API..."

    API_URL=$(terraform output -raw api_gateway_url 2>/dev/null)
    if [ -z "$API_URL" ]; then
        print_error "URL de l'API non trouvée"
        exit 1
    fi

    print_status "Test de l'endpoint: $API_URL"

    # Test avec curl
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test User",
            "email": "test@example.com",
            "message": "Ceci est un message de test depuis le script de déploiement"
        }' || echo "000")

    HTTP_CODE=${RESPONSE: -3}
    BODY=${RESPONSE%???}

    if [ "$HTTP_CODE" == "200" ]; then
        print_success "API opérationnelle (HTTP $HTTP_CODE)"
        echo "Réponse: $BODY"
    else
        print_error "Erreur API (HTTP $HTTP_CODE)"
        echo "Réponse: $BODY"
    fi
}

# Validation de la configuration
validate_config() {
    print_status "Validation de la configuration Terraform..."
    terraform validate
    if [ $? -eq 0 ]; then
        print_success "Configuration Terraform valide"
    else
        print_error "Configuration Terraform invalide"
        exit 1
    fi
}

# Nettoyage des fichiers temporaires
cleanup() {
    print_status "Nettoyage des fichiers temporaires..."
    rm -f tfplan
    rm -f contact_validator.zip
    rm -f email_sender.zip
    print_success "Nettoyage terminé"
}

# Menu d'aide
show_help() {
    echo "Script de déploiement pour l'infrastructure de formulaire de contact"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  plan      - Affiche le plan de déploiement sans l'appliquer"
    echo "  apply     - Déploie l'infrastructure complète"
    echo "  destroy   - Détruit l'infrastructure (ATTENTION: destructif)"
    echo "  test      - Teste l'API déployée"
    echo "  outputs   - Affiche les informations de l'infrastructure"
    echo "  validate  - Valide la configuration Terraform"
    echo "  cleanup   - Nettoie les fichiers temporaires"
    echo "  help      - Affiche cette aide"
    echo
    echo "Exemples:"
    echo "  $0 plan           # Voir ce qui va être créé"
    echo "  $0 apply          # Déployer l'infrastructure"
    echo "  $0 test           # Tester l'API après déploiement"
    echo "  $0 destroy        # Détruire l'infrastructure"
}

# Fonction principale
main() {
    case ${1:-help} in
        plan)
            check_prerequisites
            setup_lambda_directory
            terraform_init
            validate_config
            terraform_plan
            ;;
        apply)
            check_prerequisites
            setup_lambda_directory
            check_ses_email
            terraform_init
            validate_config
            terraform_plan
            terraform_apply
            ;;
        destroy)
            check_prerequisites
            terraform_destroy
            cleanup
            ;;
        test)
            test_api
            ;;
        outputs)
            show_outputs
            ;;
        validate)
            validate_config
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Commande inconnue: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Point d'entrée
main "$@"