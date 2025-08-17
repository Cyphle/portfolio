# 🟠 Script de déploiement Amber

Ce projet utilise maintenant [Amber Lang](https://amber-lang.com/) pour le script de déploiement, offrant une syntaxe moderne et plus lisible que Bash.

## 📦 Installation d'Amber

### Installation rapide (Linux/macOS)
```bash
# Via curl
curl -fsSL https://amber-lang.com/install.sh | bash

# Via Homebrew (macOS)
brew install amber-lang

# Via cargo (Rust)
cargo install amber-lang
```

### Installation manuelle
```bash
# Télécharger depuis GitHub
wget https://github.com/Ph0enixKM/Amber/releases/latest/download/amber-x86_64-unknown-linux-gnu.tar.gz
tar -xzf amber-x86_64-unknown-linux-gnu.tar.gz
sudo mv amber /usr/local/bin/
```

### Vérification de l'installation
```bash
amber --version
```

## 🚀 Utilisation du script Amber

### Syntaxe
```bash
# Exécution directe
amber deploy.ab [command]

# Ou rendre le fichier exécutable
chmod +x deploy.ab
./deploy.ab [command]
```

### Commandes disponibles

```bash
# Planifier les changements
amber deploy.ab plan

# Déployer l'infrastructure
amber deploy.ab apply

# Tester l'API déployée
amber deploy.ab test

# Afficher les informations
amber deploy.ab outputs

# Valider la configuration
amber deploy.ab validate

# Nettoyer les fichiers temporaires
amber deploy.ab cleanup

# Détruire l'infrastructure (ATTENTION!)
amber deploy.ab destroy

# Afficher l'aide
amber deploy.ab help
```

## ✨ Avantages d'Amber vs Bash

### 🔧 Syntaxe moderne
```amber
// Amber - Lisible et expressif
fun check_prerequisites(): Bool {
    print_status("Vérification des prérequis...")
    
    let terraform_check = $terraform version$ failed {
        print_error("Terraform n'est pas installé")
        return false
    }
    
    return true
}
```

```bash
# Bash - Verbeux et difficile à maintenir
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform n'est pas installé"
        return 1
    fi
    
    return 0
}
```

### 🛡️ Sécurité renforcée
- **Gestion d'erreurs intégrée** : `$ command $ failed { ... }`
- **Types forts** : Pas de variables non définies
- **Validation automatique** : Moins d'erreurs de runtime

### 🎯 Fonctionnalités avancées
- **Pattern matching** : `match command { ... }`
- **Fonctions pures** : Pas d'effets de bord cachés
- **Interpolation sécurisée** : `"Hello {name}"`

## 📋 Prérequis pour le script Amber

1. **Amber Lang** installé
2. **Terraform** >= 1.0
3. **AWS CLI** >= 2.0
4. **Credentials AWS** configurés
5. **Fichier terraform.tfvars** configuré

## 🔄 Migration depuis Bash

Si vous aviez l'ancien script `deploy.sh`, vous pouvez le remplacer par le nouveau script Amber :

```bash
# Sauvegarder l'ancien script (optionnel)
mv deploy.sh deploy.sh.backup

# Le nouveau script s'appelle deploy.ab
# Utilisation identique mais avec amber
amber deploy.ab apply
```

## 🐛 Dépannage Amber

### Erreur "amber: command not found"
```bash
# Vérifier l'installation
which amber

# Réinstaller si nécessaire
curl -fsSL https://amber-lang.com/install.sh | bash
source ~/.bashrc  # ou ~/.zshrc
```

### Erreur de permissions
```bash
# Rendre le script exécutable
chmod +x deploy.ab

# Ou exécuter directement avec amber
amber deploy.ab help
```

### Erreur de syntaxe
```bash
# Vérifier la syntaxe Amber
amber check deploy.ab

# Compiler pour voir les erreurs détaillées
amber compile deploy.ab
```

## 📊 Comparaison des performances

| Aspect | Bash | Amber |
|--------|------|-------|
| Lisibilité | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Maintenance | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Sécurité | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Gestion d'erreurs | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Performance | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🔗 Ressources Amber

- **Site officiel** : https://amber-lang.com/
- **Documentation** : https://amber-lang.com/learn/
- **GitHub** : https://github.com/Ph0enixKM/Amber
- **Playground** : https://amber-lang.com/playground/

## 📝 Fonctionnalités du script

### ✅ Vérifications automatiques
- Présence de Terraform et AWS CLI
- Configuration des credentials AWS
- Existence du fichier `terraform.tfvars`
- Vérification des fichiers Lambda
- Configuration SES

### 🔧 Gestion intelligente
- **Extraction automatique** des variables Terraform
- **Configuration SES interactive** si email non vérifié
- **Nettoyage automatique** des fichiers temporaires
- **Test API intégré** après déploiement

### 🎨 Interface utilisateur
- **Codes couleur** pour une meilleure lisibilité
- **Messages d'état** détaillés
- **Gestion d'erreurs** explicite
- **Aide contextuelle** complète

## 🌟 Exemple d'utilisation complète

```bash
# Installation d'Amber (une seule fois)
curl -fsSL https://amber-lang.com/install.sh | bash

# Configuration du projet
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Éditer vos valeurs

# Vérification avant déploiement
amber deploy.ab validate

# Déploiement complet
amber deploy.ab apply

# Test de l'infrastructure
amber deploy.ab test

# Affichage des informations
amber deploy.ab outputs
```

Le script Amber offre une expérience de déploiement plus moderne, sûre et maintenable que les scripts Bash traditionnels ! 🚀