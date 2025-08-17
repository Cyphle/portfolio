import json
import boto3
import re
import html
import os
from datetime import datetime
import uuid
from typing import Dict, Any

# Clients AWS
s3_client = boto3.client('s3')
sns_client = boto3.client('sns')

# Variables d'environnement
BUCKET_NAME = os.environ['BUCKET_NAME']
SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']
ALLOWED_ORIGIN = os.environ.get('ALLOWED_ORIGIN', '*')

class ValidationError(Exception):
    """Exception personnalisée pour les erreurs de validation"""
    pass

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Handler principal de la Lambda de validation
    """
    try:
        print(f"Événement reçu: {json.dumps(event)}")

        # Vérification de la méthode HTTP
        if event.get('httpMethod') != 'POST':
            return create_response(405, {'error': 'Méthode non autorisée'})

        # Parse du body
        try:
            body = json.loads(event.get('body', '{}'))
        except json.JSONDecodeError:
            return create_response(400, {'error': 'JSON invalide'})

        # Validation et nettoyage des données
        validated_data = validate_and_sanitize(body)

        # Sauvegarde en S3
        s3_key = save_to_s3(validated_data)

        # Envoi de la notification SNS
        send_sns_notification(validated_data, s3_key)

        return create_response(200, {
            'message': 'Message reçu avec succès',
            'id': validated_data['id']
        })

    except ValidationError as e:
        print(f"Erreur de validation: {str(e)}")
        return create_response(400, {'error': str(e)})

    except Exception as e:
        print(f"Erreur inattendue: {str(e)}")
        return create_response(500, {'error': 'Erreur interne du serveur'})

def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Crée une réponse HTTP avec les headers CORS appropriés
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body, ensure_ascii=False)
    }

def validate_and_sanitize(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Valide et nettoie les données du formulaire de contact
    """
    # Vérification des champs requis
    required_fields = ['name', 'email', 'message']
    for field in required_fields:
        if field not in data:
            raise ValidationError(f"Le champ '{field}' est requis")
        if not isinstance(data[field], str) or not data[field].strip():
            raise ValidationError(f"Le champ '{field}' ne peut pas être vide")

    validated = {}

    # Validation du nom
    validated['name'] = validate_name(data['name'])

    # Validation de l'email
    validated['email'] = validate_email(data['email'])

    # Validation du message
    validated['message'] = validate_message(data['message'])

    # Ajout de métadonnées
    validated['timestamp'] = datetime.utcnow().isoformat()
    validated['id'] = str(uuid.uuid4())
    validated['ip_address'] = get_client_ip(data)

    return validated

def validate_name(name: str) -> str:
    """
    Valide et nettoie le nom
    """
    # Nettoyage de base
    name = name.strip()

    # Vérification de la longueur
    if len(name) > 100:
        raise ValidationError("Le nom ne peut pas dépasser 100 caractères")

    if len(name) < 2:
        raise ValidationError("Le nom doit contenir au moins 2 caractères")

    # Vérification des caractères autorisés (lettres, espaces, tirets, apostrophes, points)
    if not re.match(r'^[a-zA-ZÀ-ÿ\u0100-\u017F\u1E00-\u1EFF\s\-\'\.]+$', name):
        raise ValidationError("Le nom contient des caractères non autorisés")

    # Échappement HTML pour la sécurité
    name = html.escape(name)

    return name

def validate_email(email: str) -> str:
    """
    Valide et nettoie l'email
    """
    # Nettoyage de base
    email = email.strip().lower()

    # Vérification de la longueur
    if len(email) > 254:
        raise ValidationError("L'adresse email est trop longue")

    if len(email) < 5:
        raise ValidationError("L'adresse email est trop courte")

    # Validation du format email (RFC 5322 simplifié)
    email_pattern = r'^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
    if not re.match(email_pattern, email):
        raise ValidationError("Format d'adresse email invalide")

    # Vérifications supplémentaires de sécurité
    suspicious_patterns = [
        r'[<>\"\'`]',  # Caractères HTML suspects
        r'javascript:', r'data:', r'vbscript:',  # Protocoles suspects
    ]

    for pattern in suspicious_patterns:
        if re.search(pattern, email, re.IGNORECASE):
            raise ValidationError("Adresse email contenant des caractères suspects")

    return email

def validate_message(message: str) -> str:
    """
    Valide et nettoie le message
    """
    # Nettoyage de base
    message = message.strip()

    # Vérification de la longueur
    if len(message) > 2000:
        raise ValidationError("Le message ne peut pas dépasser 2000 caractères")

    if len(message) < 10:
        raise ValidationError("Le message doit contenir au moins 10 caractères")

    # Détection de patterns suspects (injections, scripts, etc.)
    suspicious_patterns = [
        r'<script[^>]*>.*?</script>',  # Scripts
        r'javascript:',               # JavaScript URLs
        r'onload\s*=',               # Event handlers
        r'onerror\s*=',
        r'onclick\s*=',
        r'onmouseover\s*=',
        r'eval\s*\(',                # Eval functions
        r'document\.',               # DOM manipulation
        r'window\.',                 # Window object
        r'<iframe[^>]*>',            # Iframes
        r'<embed[^>]*>',             # Embed tags
        r'<object[^>]*>',            # Object tags
        r'<link[^>]*>',              # Link tags
        r'<meta[^>]*>',              # Meta tags
        r'data:text/html',           # Data URLs
        r'vbscript:',                # VBScript
        r'expression\s*\(',          # CSS expressions
        r'url\s*\(',                 # CSS URL functions
        r'@import',                  # CSS imports
        r'<!--.*?-->',               # Commentaires HTML
        r'\/\*.*?\*\/',              # Commentaires CSS
    ]

    for pattern in suspicious_patterns:
        if re.search(pattern, message, re.IGNORECASE | re.DOTALL):
            raise ValidationError("Le message contient du contenu suspect")

    # Vérification de patterns de spam
    spam_patterns = [
        r'(https?://[^\s]+){3,}',    # Nombreux liens
        r'[A-Z]{10,}',               # Texte en majuscules
        r'(.)\1{10,}',               # Caractères répétés
        r'(viagra|cialis|casino|lottery|winner|congratulations|urgent|click here|free money)',
    ]

    spam_count = 0
    for pattern in spam_patterns:
        if re.search(pattern, message, re.IGNORECASE):
            spam_count += 1

    if spam_count >= 2:
        raise ValidationError("Le message ressemble à du spam")

    # Échappement HTML pour la sécurité
    message = html.escape(message)

    return message

def get_client_ip(data: Dict[str, Any]) -> str:
    """
    Récupère l'adresse IP du client (pour logging/audit)
    """
    # Dans un vrai environnement, récupérer depuis les headers
    return "unknown"

def save_to_s3(data: Dict[str, Any]) -> str:
    """
    Sauvegarde les données validées dans S3
    """
    try:
        # Création de la clé S3 avec structure de dossiers par date
        date_prefix = data['timestamp'][:10]  # YYYY-MM-DD
        s3_key = f"contacts/{date_prefix}/{data['id']}.json"

        # Préparation des données pour S3
        s3_data = {
            **data,
            'created_at': data['timestamp'],
            'source': 'contact_form_v1'
        }

        # Upload vers S3
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=json.dumps(s3_data, indent=2, ensure_ascii=False),
            ContentType='application/json',
            Metadata={
                'contact-id': data['id'],
                'created-at': data['timestamp']
            }
        )

        print(f"Données sauvegardées en S3: {s3_key}")
        return s3_key

    except Exception as e:
        print(f"Erreur lors de la sauvegarde S3: {str(e)}")
        raise

def send_sns_notification(data: Dict[str, Any], s3_key: str) -> None:
    """
    Envoie une notification SNS
    """
    try:
        # Préparation du message pour SNS
        sns_message = {
            'contact_id': data['id'],
            'timestamp': data['timestamp'],
            'name': data['name'],
            'email': data['email'],
            'message_preview': data['message'][:150] + '...' if len(data['message']) > 150 else data['message'],
            's3_key': s3_key,
            'source': 'contact_form'
        }

        # Publication du message
        response = sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Message=json.dumps(sns_message, ensure_ascii=False),
            Subject=f'Nouveau message de contact de {data["name"]}',
            MessageAttributes={
                'contact_id': {
                    'DataType': 'String',
                    'StringValue': data['id']
                },
                'email': {
                    'DataType': 'String',
                    'StringValue': data['email']
                }
            }
        )

        print(f"Notification SNS envoyée: {response['MessageId']}")

    except Exception as e:
        print(f"Erreur lors de l'envoi SNS: {str(e)}")
        # Ne pas faire échouer la requête si SNS échoue
        pass