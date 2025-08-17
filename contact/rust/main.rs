use std::env;
use std::fs;
use std::io::{self, Write};
use std::path::Path;
use std::process::{Command, ExitStatus};
use clap::{Parser, Subcommand};
use colored::*;
use anyhow::{Context, Result, anyhow};
use serde_json::Value;

/// Script de déploiement pour l'infrastructure de formulaire de contact AWS
#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Affiche le plan de déploiement sans l'appliquer
    Plan,
    /// Déploie l'infrastructure complète
    Apply,
    /// Détruit l'infrastructure (ATTENTION: destructif)
    Destroy,
    /// Teste l'API déployée
    Test,
    /// Affiche les informations de l'infrastructure
    Outputs,
    /// Valide la configuration Terraform
    Validate,
    /// Nettoie les fichiers temporaires
    Cleanup,
}

struct DeploymentManager {
    verbose: bool,
}

impl DeploymentManager {
    fn new() -> Self {
        Self {
            verbose: env::var("VERBOSE").is_ok(),
        }
    }

    // Fonctions d'affichage avec couleurs
    fn print_status(&self, message: &str) {
        println!("{} {}", "[INFO]".blue().bold(), message);
    }

    fn print_success(&self, message: &str) {
        println!("{} {}", "[SUCCESS]".green().bold(), message);
    }

    fn print_warning(&self, message: &str) {
        println!("{} {}", "[WARNING]".yellow().bold(), message);
    }

    fn print_error(&self, message: &str) {
        eprintln!("{} {}", "[ERROR]".red().bold(), message);
    }

    // Exécution de commandes avec gestion d'erreurs
    fn run_command(&self, program: &str, args: &[&str]) -> Result<String> {
        if self.verbose {
            println!("Executing: {} {}", program, args.join(" "));
        }

        let output = Command::new(program)
            .args(args)
            .output()
            .context(format!("Failed to execute {} {}", program, args.join(" ")))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!(
                "Command failed with exit code {:?}: {}",
                output.status.code(),
                stderr
            ));
        }

        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }

    fn run_command_interactive(&self, program: &str, args: &[&str]) -> Result<ExitStatus> {
        if self.verbose {
            println!("Executing (interactive): {} {}", program, args.join(" "));
        }

        let status = Command::new(program)
            .args(args)
            .status()
            .context(format!("Failed to execute {} {}", program, args.join(" ")))?;

        Ok(status)
    }

    // Vérification des prérequis
    fn check_prerequisites(&self) -> Result<()> {
        self.print_status("Vérification des prérequis...");

        // Vérifier Terraform
        self.run_command("terraform", &["version"])
            .context("Terraform n'est pas installé ou non accessible")?;

        // Vérifier AWS CLI
        self.run_command("aws", &["--version"])
            .context("AWS CLI n'est pas installé ou non accessible")?;

        // Vérifier les credentials AWS
        self.run_command("aws", &["sts", "get-caller-identity"])
            .context("Credentials AWS non configurés")?;

        // Vérifier le fichier terraform.tfvars
        if !Path::new("terraform.tfvars").exists() {
            return Err(anyhow!(
                "Fichier terraform.tfvars manquant. Copiez terraform.tfvars.example et modifiez les valeurs"
            ));
        }

        self.print_success("Tous les prérequis sont satisfaits");
        Ok(())
    }

    // Configuration du dossier lambda
    fn setup_lambda_directory(&self) -> Result<()> {
        self.print_status("Préparation du dossier lambda...");

        if !Path::new("lambda").exists() {
            fs::create_dir("lambda")
                .context("Impossible de créer le dossier lambda")?;
            self.print_status("Dossier lambda créé");
        }

        // Vérification des fichiers Lambda
        if !Path::new("lambda/contact_validator.py").exists() {
            self.print_warning("Fichier contact_validator.py manquant dans le dossier lambda");
            self.print_warning("Veuillez copier le code de la Lambda de validation");
        }

        if !Path::new("lambda/email_sender.py").exists() {
            self.print_warning("Fichier email_sender.py manquant dans le dossier lambda");
            self.print_warning("Veuillez copier le code de la Lambda d'envoi d'email");
        }

        Ok(())
    }

    // Extraction d'une valeur du fichier terraform.tfvars
    fn extract_tfvar(&self, key: &str) -> Result<String> {
        let content = fs::read_to_string("terraform.tfvars")
            .context("Impossible de lire terraform.tfvars")?;

        for line in content.lines() {
            if line.contains(key) && line.contains("=") {
                let parts: Vec<&str> = line.split('"').collect();
                if parts.len() >= 2 {
                    return Ok(parts[1].to_string());
                }
            }
        }

        Err(anyhow!("Variable {} non trouvée dans terraform.tfvars", key))
    }

    // Vérification de l'email SES
    fn check_ses_email(&self) -> Result<()> {
        self.print_status("Vérification de la configuration SES...");

        let email = self.extract_tfvar("notification_email")
            .context("Email de notification non trouvé dans terraform.tfvars")?;

        let region = self.extract_tfvar("aws_region")
            .context("Région AWS non trouvée dans terraform.tfvars")?;

        // Vérifier si l'email est vérifié dans SES
        let ses_check = self.run_command("aws", &[
            "ses", "get-identity-verification-attributes",
            "--identities", &email,
            "--region", &region
        ]);

        if ses_check.is_err() {
            self.print_warning(&format!("L'email {} n'est pas configuré dans SES", email));
            self.print_warning(&format!(
                "Exécutez: aws ses verify-email-identity --email-address {} --region {}",
                email, region
            ));
            self.print_warning("Puis vérifiez votre boîte mail et cliquez sur le lien de vérification");

            print!("Voulez-vous que je configure automatiquement l'email dans SES ? (y/N): ");
            io::stdout().flush()?;

            let mut input = String::new();
            io::stdin().read_line(&mut input)?;
            let response = input.trim().to_lowercase();

            if response == "y" || response == "yes" {
                self.run_command("aws", &[
                    "ses", "verify-email-identity",
                    "--email-address", &email,
                    "--region", &region
                ])?;
                self.print_success(&format!("Demande de vérification envoyée à {}", email));
                self.print_warning("Vérifiez votre boîte mail et cliquez sur le lien avant de continuer");
            }

            return Err(anyhow!("Configuration SES requise"));
        }

        self.print_success("Email SES vérifié");
        Ok(())
    }

    // Initialisation Terraform
    fn terraform_init(&self) -> Result<()> {
        self.print_status("Initialisation de Terraform...");
        let status = self.run_command_interactive("terraform", &["init"])?;

        if !status.success() {
            return Err(anyhow!("Erreur lors de l'initialisation Terraform"));
        }

        self.print_success("Terraform initialisé");
        Ok(())
    }

    // Validation de la configuration
    fn validate_config(&self) -> Result<()> {
        self.print_status("Validation de la configuration Terraform...");
        self.run_command("terraform", &["validate"])
            .context("Configuration Terraform invalide")?;
        self.print_success("Configuration Terraform valide");
        Ok(())
    }

    // Plan Terraform
    fn terraform_plan(&self) -> Result<()> {
        self.print_status("Génération du plan Terraform...");
        let status = self.run_command_interactive("terraform", &["plan", "-out=tfplan"])?;

        if !status.success() {
            return Err(anyhow!("Erreur lors de la génération du plan"));
        }

        self.print_success("Plan généré (sauvegardé dans tfplan)");
        Ok(())
    }

    // Apply Terraform
    fn terraform_apply(&self) -> Result<()> {
        self.print_status("Application du plan Terraform...");

        let status = if Path::new("tfplan").exists() {
            let status = self.run_command_interactive("terraform", &["apply", "tfplan"])?;
            // Supprimer le plan après application
            let _ = fs::remove_file("tfplan");
            status
        } else {
            self.print_warning("Aucun plan trouvé, application directe...");
            self.run_command_interactive("terraform", &["apply"])?
        };

        if !status.success() {
            return Err(anyhow!("Erreur lors de l'application"));
        }

        self.print_success("Infrastructure déployée");

        // Affichage des outputs importants
        self.print_status("Récupération des informations de déploiement...");

        let api_url = self.run_command("terraform", &["output", "-raw", "api_gateway_url"])
            .unwrap_or_else(|_| "Non disponible".to_string());

        let bucket_name = self.run_command("terraform", &["output", "-raw", "s3_bucket_name"])
            .unwrap_or_else(|_| "Non disponible".to_string());

        println!();
        self.print_success("=== DÉPLOIEMENT TERMINÉ ===");
        println!("{} {}", "URL de l'API:".green().bold(), api_url);
        println!("{} {}", "Bucket S3:".green().bold(), bucket_name);
        println!();
        self.print_warning("N'oubliez pas de:");
        println!("1. Vérifier votre email dans SES si ce n'est pas déjà fait");
        println!("2. Mettre à jour l'URL de l'API dans votre composant React");
        println!("3. Configurer CORS avec votre domaine exact si nécessaire");

        Ok(())
    }

    // Destroy Terraform
    fn terraform_destroy(&self) -> Result<()> {
        self.print_warning("ATTENTION: Cette action va détruire toute l'infrastructure");
        self.print_warning("Toutes les données dans S3 seront perdues");
        println!();
        print!("Êtes-vous sûr de vouloir continuer ? Tapez 'yes' pour confirmer: ");
        io::stdout().flush()?;

        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        let response = input.trim();

        if response == "yes" {
            self.print_status("Destruction de l'infrastructure...");
            let status = self.run_command_interactive("terraform", &["destroy"])?;

            if !status.success() {
                return Err(anyhow!("Erreur lors de la destruction"));
            }

            self.print_success("Infrastructure détruite");
        } else {
            self.print_status("Destruction annulée");
        }

        Ok(())
    }

    // Affichage des outputs
    fn show_outputs(&self) -> Result<()> {
        self.print_status("Informations de l'infrastructure actuelle:");
        let status = self.run_command_interactive("terraform", &["output"])?;

        if !status.success() {
            return Err(anyhow!("Erreur lors de la récupération des outputs"));
        }

        Ok(())
    }

    // Test de l'API
    fn test_api(&self) -> Result<()> {
        self.print_status("Test de l'API...");

        let api_url = self.run_command("terraform", &["output", "-raw", "api_gateway_url"])
            .context("URL de l'API non trouvée")?;

        self.print_status(&format!("Test de l'endpoint: {}", api_url));

        // Données de test
        let test_data = r#"{
            "name": "Test User",
            "email": "test@example.com",
            "message": "Ceci est un message de test depuis le script de déploiement Rust"
        }"#;

        // Test avec curl
        let output = self.run_command("curl", &[
            "-s", "-w", "%{http_code}",
            "-X", "POST", &api_url,
            "-H", "Content-Type: application/json",
            "-d", test_data
        ])?;

        let response_len = output.len();
        if response_len < 3 {
            return Err(anyhow!("Réponse invalide de l'API"));
        }

        let http_code = &output[response_len - 3..];
        let body = &output[..response_len - 3];

        if http_code == "200" {
            self.print_success(&format!("API opérationnelle (HTTP {})", http_code));
            println!("Réponse: {}", body);
        } else {
            self.print_error(&format!("Erreur API (HTTP {})", http_code));
            println!("Réponse: {}", body);
            return Err(anyhow!("Test API échoué"));
        }

        Ok(())
    }

    // Nettoyage des fichiers temporaires
    fn cleanup(&self) -> Result<()> {
        self.print_status("Nettoyage des fichiers temporaires...");

        let files_to_remove = ["tfplan", "contact_validator.zip", "email_sender.zip"];

        for file in &files_to_remove {
            if Path::new(file).exists() {
                fs::remove_file(file)
                    .context(format!("Impossible de supprimer {}", file))?;
            }
        }

        self.print_success("Nettoyage terminé");
        Ok(())
    }

    // Exécution des commandes
    fn execute_command(&self, command: Commands) -> Result<()> {
        match command {
            Commands::Plan => {
                self.check_prerequisites()?;
                self.setup_lambda_directory()?;
                self.terraform_init()?;
                self.validate_config()?;
                self.terraform_plan()?;
            }
            Commands::Apply => {
                self.check_prerequisites()?;
                self.setup_lambda_directory()?;
                self.check_ses_email()?;
                self.terraform_init()?;
                self.validate_config()?;
                self.terraform_plan()?;
                self.terraform_apply()?;
            }
            Commands::Destroy => {
                self.check_prerequisites()?;
                self.terraform_destroy()?;
                self.cleanup()?;
            }
            Commands::Test => {
                self.test_api()?;
            }
            Commands::Outputs => {
                self.show_outputs()?;
            }
            Commands::Validate => {
                self.validate_config()?;
            }
            Commands::Cleanup => {
                self.cleanup()?;
            }
        }

        Ok(())
    }
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    let manager = DeploymentManager::new();

    // Affichage de l'aide si aucune commande n'est fournie
    let command = match cli.command {
        Some(cmd) => cmd,
        None => {
            show_help();
            return Ok(());
        }
    };

    // Exécution de la commande
    if let Err(err) = manager.execute_command(command) {
        manager.print_error(&format!("Erreur: {}", err));

        if manager.verbose {
            eprintln!("Détails: {:?}", err);
        }

        std::process::exit(1);
    }

    Ok(())
}

fn show_help() {
    println!("{}", "Script de déploiement pour l'infrastructure de formulaire de contact (Rust)".bold());
    println!();
    println!("Usage: {} [COMMAND]", env::args().next().unwrap_or_else(|| "deploy".to_string()));
    println!();
    println!("Commands:");
    println!("  {}      - Affiche le plan de déploiement sans l'appliquer", "plan".cyan());
    println!("  {}     - Déploie l'infrastructure complète", "apply".cyan());
    println!("  {}   - Détruit l'infrastructure (ATTENTION: destructif)", "destroy".cyan());
    println!("  {}      - Teste l'API déployée", "test".cyan());
    println!("  {}   - Affiche les informations de l'infrastructure", "outputs".cyan());
    println!("  {}  - Valide la configuration Terraform", "validate".cyan());
    println!("  {}   - Nettoie les fichiers temporaires", "cleanup".cyan());
    println!();
    println!("Exemples:");
    println!("  {} plan          # Voir ce qui va être créé", env::args().next().unwrap_or_else(|| "deploy".to_string()));
    println!("  {} apply         # Déployer l'infrastructure", env::args().next().unwrap_or_else(|| "deploy".to_string()));
    println!("  {} test          # Tester l'API après déploiement", env::args().next().unwrap_or_else(|| "deploy".to_string()));
    println!("  {} destroy       # Détruire l'infrastructure", env::args().next().unwrap_or_else(|| "deploy".to_string()));
    println!();
    println!("Variables d'environnement:");
    println!("  {}         - Active le mode verbeux", "VERBOSE=1".green());
    println!();
    println!("Prérequis:");
    println!("  - Rust >= 1.70");
    println!("  - Terraform >= 1.0");
    println!("  - AWS CLI >= 2.0");
    println!("  - Credentials AWS configurés");
    println!("  - Fichier terraform.tfvars configuré");
}