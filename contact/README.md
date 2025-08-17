# 📧 Infrastructure de Formulaire de Contact AWS

Une solution complète et sécurisée pour gérer les formulaires de contact avec AWS Lambda, API Gateway, S3 et SNS.

## 🏗️ Architecture

```
Site statique (React) → API Gateway → Lambda (validation) → S3 + SNS → Lambda (email)
```

### Composants:
- **Site statique**: Composant React avec formulaire
- **API Gateway**: Point d'entrée HTTPS avec CORS
- **Lambda de validation**: Validation et nettoyage des données
- **S3**: Stockage des messages
- **SNS**: Notifications
- **Lambda d'email**: Envoi via SES
- **SES**: Service d'email d'Amazon

## 📋 Prérequis

### Outils requis:
- [Terraform](https://terraform.io) >= 1.0
- [AWS CLI](https://aws.amazon.com/cli/) >= 2.0
- Compte AWS avec permissions appropriées

### Permissions AWS nécessaires:
- IAM (création de rôles et politiques)
- Lambda (création et gestion des fonctions)
- API Gateway (création d'APIs)
- S3 (création et gestion de buckets)
- SNS (création de topics)
- SES (envoi d'emails)
- CloudWatch (logs)

## 🚀 Installation rapide

### 1. Cloner et configurer

```bash
# Créer le dossier du projet
mkdir contact-form-aws && cd contact-form-aws

# Copier tous les fichiers Terraform et Lambda dans ce dossier
# (main.tf, terraform.tfvars.example, deploy.sh, etc.)

# Créer le dossier lambda
mkdir lambda

# Copier les fichiers Python des Lambda dans le dossier lambda/
# - contact_validator.py
# - email_sender.py
```

### 2. Configuration

```bash
# Copier et configurer les variables
cp terraform.tfvars.example terraform.tfvars

# Éditer terraform.tfvars avec vos valeurs
nano terraform.tfvars
```

**Exemple de configuration:**
```hcl
aws_region = "eu-west-1"
environment = "prod"
project_name = "mon-site-contact"
notification_email = "contact@monsite.com"
domain_name = "https://monsite.com"
```

### 3. Configurer AWS SES

**Important**: Vous devez vérifier votre email dans SES avant le déploiement.

```bash
# Vérifier votre email dans SES
aws ses verify-email-identity \
  --email-address votre-email@exemple.com \
  --region eu-west-1

# Vérifiez votre boîte mail et cliquez sur le lien de confirmation
```

### 4. Déployer

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Voir ce qui va être créé
./deploy.sh plan

# Déployer l'infrastructure
./deploy.sh apply

# Tester l'API
./deploy.sh test
```

## 📁 Structure du projet

```
contact-form-aws/
├── main.tf                    # Infrastructure Terraform principale
├── terraform.tfvars.example  # Exemple de configuration
├── terraform.tfvars         # Votre configuration (à créer)
├── deploy.sh                # Script de déploiement
├── lambda/
│   ├── contact_validator.py # Lambda de validation
│   └── email_sender.py      # Lambda d'envoi d'email
└── frontend/
    └── ContactForm.jsx      # Composant React
```

## 🔧 Configuration détaillée

### Variables Terraform

| Variable | Description | Exemple |
|----------|-------------|---------|
| `aws_region` | Région AWS | `eu-west-1` |
| `environment` | Environnement | `prod` |
| `project_name` | Nom du projet | `contact-form` |
| `notification_email` | Email de réception | `contact@exemple.com` |
| `domain_name` | Domaine pour CORS | `https://monsite.com` |

### Configuration SES

Pour utiliser SES en production:

1. **Sortir du Sandbox SES** (si nécessaire):
   ```bash
   aws sesv2 get-account --region eu-west-1
   ```

2. **Vérifier les domaines** (optionnel):
   ```bash
   aws ses verify-domain-identity --domain exemple.com --region eu-west-1
   ```

### CORS et sécurité

- Par défaut, CORS autorise tous les domaines (`*`)
- En production, spécifiez votre domaine exact:
  ```hcl
  domain_name = "https://monsite.com"
  ```

## 🎯 Utilisation du composant React

### Installation dans votre projet

```bash
npm install
# Le composant utilise Tailwind CSS pour le styling
```

### Utilisation de base

```jsx
import ContactForm from './components/ContactForm';

function App() {
  return (
    <div className="App">
      <ContactForm 
        apiUrl="https://votre-api-gateway-url/prod/contact"
      />
    </div>
  );
}
```

### Utilisation avec variables d'environnement

```bash
# .env
REACT_APP_API_GATEWAY_URL=https://abc123.execute-api.eu-west-1.amazonaws.com/prod/contact
```

```jsx
<ContactForm />  {/* L'URL sera automatiquement récupérée */}
```

### Personnalisation

```jsx
<ContactForm 
  apiUrl="https://votre-api-url"
  className="max-w-4xl mx-auto"
/>
```

## 🛠️ Scripts de gestion

### Commandes disponibles

```bash
# Planifier les changements
./deploy.sh plan

# Déployer l'infrastructure
./deploy.sh apply

# Tester l'API
./deploy.sh test

# Voir les informations
./deploy.sh outputs

# Valider la configuration
./deploy.sh validate

# Nettoyer les fichiers temporaires
./deploy.sh cleanup

# Détruire l'infrastructure (ATTENTION!)
./deploy.sh destroy
```

## 🔍 Monitoring et logs

### CloudWatch Logs

Les logs sont automatiquement créés dans CloudWatch:

```bash
# Voir les logs de validation
aws logs tail /aws/lambda/contact-form-contact-validator --follow

# Voir les logs d'email
aws logs tail /aws/lambda/contact-form-email-sender --follow
```

### Métriques

Surveillez ces métriques dans CloudWatch:
- Nombre d'invocations Lambda
- Taux d'erreur API Gateway
- Durée d'exécution des Lambda

## 🔒 Sécurité

### Mesures de sécurité implémentées:

1. **Validation stricte des entrées**:
    - Longueur limitée des champs
    - Validation du format email
    - Échappement HTML
    - Détection de patterns suspects

2. **Protection contre les injections**:
    - Filtrage des scripts
    - Blocage des event handlers
    - Détection de contenu malveillant

3. **Protection contre le spam**:
    - Détection de patterns de spam
    - Limitation de caractères
    - Rate limiting (API Gateway)

4. **Stockage sécurisé**:
    - Chiffrement S3
    - Versioning activé
    - Accès restreint

### Rate Limiting (optionnel)

Pour ajouter du rate limiting à API Gateway:

```hcl
resource "aws_api_gateway_request_validator" "contact_validator" {
  name                        = "contact-validator"
  rest_api_id                = aws_api_gateway_rest_api.contact_api.id
  validate_request_body       = true
  validate_request_parameters = true
}

resource "aws_api_gateway_usage_plan" "contact_usage_plan" {
  name = "contact-form-usage-plan"

  throttle_settings {
    rate_limit  = 100
    burst_limit = 200
  }

  quota_settings {
    limit  = 10000
    period = "DAY"
  }
}
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Email non vérifié dans SES
```
Error: Email address not verified
```
**Solution**: Vérifiez votre email dans SES et cliquez sur le lien de confirmation.

#### 2. Erreur CORS
```
Access to fetch blocked by CORS policy
```
**Solution**: Vérifiez que `domain_name` dans `terraform.tfvars` correspond à votre domaine.

#### 3. Lambda timeout
```
Task timed out after 30.00 seconds
```
**Solution**: Augmentez le timeout dans la configuration Terraform.

#### 4. Permissions IAM insuffisantes
```
AccessDenied: User is not authorized
```
**Solution**: Vérifiez que votre utilisateur AWS a les permissions nécessaires.

### Debug des Lambda

```bash
# Activer les logs détaillés
export TF_LOG=DEBUG

# Tester une Lambda localement (avec SAM)
sam local invoke ContactValidator -e test-event.json
```

### Test manuel de l'API

```bash
curl -X POST https://votre-api-url/prod/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Message de test"
  }'
```

## 💰 Coûts estimés

### Coûts AWS (estimations mensuelles):

- **Lambda**: ~0.20$ pour 1000 requêtes
- **API Gateway**: ~3.50$ pour 1 million de requêtes
- **S3**: ~0.10$ pour 10GB de stockage
- **SNS**: ~0.50$ pour 1 million de notifications
- **SES**: ~0.10$ pour 1000 emails

**Total estimé**: < 5$/mois pour un usage modéré

### Optimisation des coûts:

1. Utilisez le free tier AWS
2. Configurez une politique de cycle de vie S3
3. Supprimez les anciens logs CloudWatch

## 🔄 Mise à jour

### Mettre à jour l'infrastructure:

```bash
# Modifier main.tf ou terraform.tfvars
# Puis redéployer
./deploy.sh plan
./deploy.sh apply
```

### Mettre à jour les Lambda:

```bash
# Modifier les fichiers dans lambda/
# Puis redéployer
./deploy.sh apply
```

## 🗑️ Suppression

Pour supprimer complètement l'infrastructure:

```bash
# ATTENTION: Cela supprime TOUT
./deploy.sh destroy

# Vérifier que tout est supprimé
aws s3 ls | grep contact-form
```

## 📞 Support

En cas de problème:

1. Vérifiez les logs CloudWatch
2. Consultez la section dépannage
3. Vérifiez la configuration AWS
4. Testez étape par étape

## 📄 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.