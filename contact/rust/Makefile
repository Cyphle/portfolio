# Makefile pour le script de déploiement Rust

# Variables
CARGO = cargo
BINARY_NAME = deploy
TARGET_DIR = target/release
INSTALL_DIR = /usr/local/bin

# Couleurs pour l'affichage
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help build build-release install clean test lint fmt check run-plan run-apply run-test docs

# Cible par défaut
help: ## Affiche cette aide
	@echo "$(GREEN)Script de déploiement Rust - Makefile$(NC)"
	@echo ""
	@echo "$(YELLOW)Targets disponibles:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Construction
build: ## Compile le projet en mode debug
	@echo "$(YELLOW)🔨 Compilation en mode debug...$(NC)"
	$(CARGO) build

build-release: ## Compile le projet en mode release (optimisé)
	@echo "$(YELLOW)🔨 Compilation en mode release...$(NC)"
	$(CARGO) build --release

# Installation
install: build-release ## Installe le binaire dans /usr/local/bin
	@echo "$(YELLOW)📦 Installation du binaire...$(NC)"
	sudo cp $(TARGET_DIR)/$(BINARY_NAME) $(INSTALL_DIR)/
	@echo "$(GREEN)✅ Binaire installé dans $(INSTALL_DIR)/$(BINARY_NAME)$(NC)"

install-local: build-release ## Installe le binaire dans ~/.local/bin
	@echo "$(YELLOW)📦 Installation locale du binaire...$(NC)"
	mkdir -p ~/.local/bin
	cp $(TARGET_DIR)/$(BINARY_NAME) ~/.local/bin/
	@echo "$(GREEN)✅ Binaire installé dans ~/.local/bin/$(BINARY_NAME)$(NC)"
	@echo "$(YELLOW)💡 Assurez-vous que ~/.local/bin est dans votre PATH$(NC)"

# Nettoyage
clean: ## Nettoie les fichiers de build
	@echo "$(YELLOW)🧹 Nettoyage...$(NC)"
	$(CARGO) clean
	rm -f tfplan *.zip

# Tests
test: ## Lance les tests
	@echo "$(YELLOW)🧪 Exécution des tests...$(NC)"
	$(CARGO) test

test-verbose: ## Lance les tests en mode verbeux
	@echo "$(YELLOW)🧪 Exécution des tests (verbeux)...$(NC)"
	$(CARGO) test -- --nocapture

# Linting et formatage
lint: ## Vérifie le code avec clippy
	@echo "$(YELLOW)🔍 Vérification du code...$(NC)"
	$(CARGO) clippy -- -D warnings

fmt: ## Formate le code
	@echo "$(YELLOW)💅 Formatage du code...$(NC)"
	$(CARGO) fmt

fmt-check: ## Vérifie le formatage du code
	@echo "$(YELLOW)💅 Vérification du formatage...$(NC)"
	$(CARGO) fmt -- --check

check: ## Vérifie la compilation sans construire
	@echo "$(YELLOW)✅ Vérification de la compilation...$(NC)"
	$(CARGO) check

# Commandes de déploiement rapides
run-plan: build ## Exécute 'plan' en mode debug
	@echo "$(YELLOW)📋 Exécution du plan Terraform...$(NC)"
	./target/debug/$(BINARY_NAME) plan

run-apply: build ## Exécute 'apply' en mode debug
	@echo "$(YELLOW)🚀 Déploiement de l'infrastructure...$(NC)"
	./target/debug/$(BINARY_NAME) apply

run-test: build ## Exécute 'test' en mode debug
	@echo "$(YELLOW)🧪 Test de l'API...$(NC)"
	./target/debug/$(BINARY_NAME) test

run-outputs: build ## Affiche les outputs
	@echo "$(YELLOW)📊 Affichage des outputs...$(NC)"
	./target/debug/$(BINARY_NAME) outputs

run-destroy: build ## Détruit l'infrastructure (ATTENTION!)
	@echo "$(RED)💥 ATTENTION: Destruction de l'infrastructure!$(NC)"
	./target/debug/$(BINARY_NAME) destroy

# Commandes optimisées (release)
run-plan-release: build-release ## Exécute 'plan' en mode release
	@echo "$(YELLOW)📋 Exécution du plan Terraform (optimisé)...$(NC)"
	./$(TARGET_DIR)/$(BINARY_NAME) plan

run-apply-release: build-release ## Exécute 'apply' en mode release
	@echo "$(YELLOW)🚀 Déploiement de l'infrastructure (optimisé)...$(NC)"
	./$(TARGET_DIR)/$(BINARY_NAME) apply

# Documentation
docs: ## Génère la documentation
	@echo "$(YELLOW)📚 Génération de la documentation...$(NC)"
	$(CARGO) doc --no-deps --open

docs-all: ## Génère la documentation avec les dépendances
	@echo "$(YELLOW)📚 Génération de la documentation complète...$(NC)"
	$(CARGO) doc --open

# Développement
dev: ## Mode développement avec surveillance des fichiers
	@echo "$(YELLOW)👀 Mode développement (surveillance des fichiers)...$(NC)"
	@echo "$(GREEN)Installez cargo-watch avec: cargo install cargo-watch$(NC)"
	cargo watch -x 'build'

dev-test: ## Mode développement avec tests automatiques
	@echo "$(YELLOW)👀 Mode développement avec tests...$(NC)"
	@echo "$(GREEN)Installez cargo-watch avec: cargo install cargo-watch$(NC)"
	cargo watch -x 'test'

# Analyse
analyze: ## Analyse complète du code
	@echo "$(YELLOW)🔍 Analyse complète du code...$(NC)"
	$(CARGO) check
	$(CARGO) clippy -- -D warnings
	$(CARGO) fmt -- --check
	$(CARGO) test

# Préparation pour la release
prepare-release: analyze ## Prépare une release
	@echo "$(YELLOW)🎯 Préparation de la release...$(NC)"
	$(CARGO) build --release
	$(CARGO) test --release
	@echo "$(GREEN)✅ Release prête!$(NC)"

# Installation des outils de développement
install-tools: ## Installe les outils de développement utiles
	@echo "$(YELLOW)🛠️ Installation des outils de développement...$(NC)"
	$(CARGO) install cargo-watch
	$(CARGO) install cargo-audit
	$(CARGO) install cargo-outdated
	$(CARGO) install cargo-bloat
	@echo "$(GREEN)✅ Outils installés!$(NC)"

# Audit de sécurité
audit: ## Audit de sécurité des dépendances
	@echo "$(YELLOW)🔒 Audit de sécurité...$(NC)"
	$(CARGO) audit

# Vérification des dépendances obsolètes
outdated: ## Vérifie les dépendances obsolètes
	@echo "$(YELLOW)📦 Vérification des dépendances...$(NC)"
	$(CARGO) outdated

# Analyse de la taille du binaire
bloat: build-release ## Analyse la taille du binaire
	@echo "$(YELLOW)📏 Analyse de la taille du binaire...$(NC)"
	$(CARGO) bloat --release

# Benchmark (si des benchmarks sont ajoutés)
bench: ## Lance les benchmarks
	@echo "$(YELLOW)⚡ Exécution des benchmarks...$(NC)"
	$(CARGO) bench

# Commandes combinées utiles
quick-deploy: build run-plan run-apply run-test ## Déploiement complet rapide (debug)
	@echo "$(GREEN)🎉 Déploiement complet terminé!$(NC)"

production-deploy: build-release run-plan-release run-apply-release ## Déploiement production (release)
	@echo "$(GREEN)🎉 Déploiement production terminé!$(NC)"

ci: analyze test ## Pipeline CI (analyse + tests)
	@echo "$(GREEN)✅ Pipeline CI réuss