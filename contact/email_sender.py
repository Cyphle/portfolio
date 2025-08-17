import json
import boto3
import os
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

# Client AWS
ses_client = boto3.client('ses')
s3_client = boto3.client('s3')

# Variables d'environnement
NOTIFICATION_EMAIL = os.environ['NOTIFICATION_EMAIL']
SOURCE_EMAIL = os.environ.get('SOURCE_EMAIL', NOTIFICATION_EMAIL)

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Handler principal pour l'envoi d'emails de notification
    """
    try:
        print(f"Événement SNS reçu: {json.dumps(event)}")

        # Parse du message SNS
        for record in event['Records']:
            if record['EventSource'] == 'aws:sns':
                sns_message = json.loads(record['Sns']['Message'])

                # Récupération des détails complets depuis S3
                full_contact_data = get_full_contact_data(sns_message)

                # Envoi de l'email
                send_email_notification(full_contact_data)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Email(s) envoyé(s) avec succès'})
        }

    except Exception as e:
        print(f"Erreur lors de l'envoi d'email: {str(e)}")
        # Re-raise pour déclencher une nouvelle tentative par SNS si configuré
        raise

def get_full_contact_data(sns_message: Dict[str, Any]) -> Dict[str, Any]:
    """
    Récupère les données complètes du contact depuis S3
    """
    try:
        if 's3_key' in sns_message:
            # Récupération depuis S3 pour avoir toutes les données
            s3_key = sns_message['s3_key']
            bucket_name = s3_key.split('/')[0] if '/' in s3_key else None

            if bucket_name:
                response = s3_client.get_object(
                    Bucket=bucket_name,
                    Key=s3_key
                )
                return json.loads(response['Body'].read().decode('utf-8'))

        # Fallback sur les données du message SNS si S3 n'est pas disponible
        return sns_message

    except Exception as e:
        print(f"Erreur lors de la récupération depuis S3: {str(e)}")
        # Utiliser les données du message SNS comme fallback
        return sns_message

def send_email_notification(contact_data: Dict[str, Any]) -> None:
    """
    Envoie l'email de notification
    """
    # Préparation du sujet
    subject = f"🔔 Nouveau message de contact - {contact_data.get('name', 'Inconnu')}"

    # Génération du contenu HTML
    html_body = generate_html_email(contact_data)

    # Génération du contenu texte
    text_body = generate_text_email(contact_data)

    try:
        # Envoi via SES
        response = ses_client.send_email(
            Source=SOURCE_EMAIL,
            Destination={
                'ToAddresses': [NOTIFICATION_EMAIL]
            },
            Message={
                'Subject': {
                    'Data': subject,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Text': {
                        'Data': text_body,
                        'Charset': 'UTF-8'
                    },
                    'Html': {
                        'Data': html_body,
                        'Charset': 'UTF-8'
                    }
                }
            },
            ReplyToAddresses=[contact_data.get('email', SOURCE_EMAIL)]
        )

        print(f"Email envoyé avec succès. MessageId: {response['MessageId']}")

    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {str(e)}")
        raise

def generate_html_email(contact_data: Dict[str, Any]) -> str:
    """
    Génère le contenu HTML de l'email
    """
    timestamp = contact_data.get('timestamp', datetime.utcnow().isoformat())
    formatted_date = format_timestamp(timestamp)

    html_template = f"""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message de contact</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }}
            .container {{
                background-color: white;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                margin: -30px -30px 30px -30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
            }}
            .field {{
                margin-bottom: 20px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }}
            .field-label {{
                font-weight: bold;
                color: #495057;
                font-size: 14px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }}
            .field-value {{
                font-size: 16px;
                word-wrap: break-word;
            }}
            .message-content {{
                background-color: #fff;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                padding: 20px;
                white-space: pre-wrap;
                font-family: Georgia, serif;
                line-height: 1.8;
            }}
            .metadata {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e9ecef;
                font-size: 14px;
                color: #6c757d;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                font-size: 12px;
                color: #6c757d;
            }}
            .reply-button {{
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                margin-top: 20px;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 Nouveau Message de Contact</h1>
            </div>

            <div class="field">
                <div class="field-label">👤 Nom</div>
                <div class="field-value">{contact_data.get('name', 'Non spécifié')}</div>
            </div>

            <div class="field">
                <div class="field-label">✉️ Email</div>
                <div class="field-value">
                    <a href="mailto:{contact_data.get('email', '')}">{contact_data.get('email', 'Non spécifié')}</a>
                </div>
            </div>

            <div class="field">
                <div class="field-label">📅 Date et heure</div>
                <div class="field-value">{formatted_date}</div>
            </div>

            <div class="field">
                <div class="field-label">💬 Message</div>
                <div class="message-content">{contact_data.get('message', 'Aucun message')}</div>
            </div>

            <div style="text-align: center;">
                <a href="mailto:{contact_data.get('email', '')}?subject=Re: Votre message de contact" class="reply-button">
                    Répondre directement
                </a>
            </div>

            <div class="metadata">
                <strong>Métadonnées :</strong><br>
                ID du message: {contact_data.get('id', 'Non spécifié')}<br>
                Source: {contact_data.get('source', 'contact_form')}<br>
                Adresse IP: {contact_data.get('ip_address', 'Non disponible')}
            </div>

            <div class="footer">
                <p>Ce message a été envoyé automatiquement depuis votre formulaire de contact.</p>
                <p>Ne pas répondre à cette adresse.</p>
            </div>
        </div>
    </body>
    </html>
    """

    return html_template

def generate_text_email(contact_data: Dict[str, Any]) -> str:
    """
    Génère le contenu texte de l'email
    """
    timestamp = contact_data.get('timestamp', datetime.utcnow().isoformat())
    formatted_date = format_timestamp(timestamp)

    text_template = f"""
NOUVEAU MESSAGE DE CONTACT
==========================

Nom: {contact_data.get('name', 'Non spécifié')}
Email: {contact_data.get('email', 'Non spécifié')}
Date: {formatted_date}

MESSAGE:
--------
{contact_data.get('message', 'Aucun message')}

MÉTADONNÉES:
-----------
ID: {contact_data.get('id', 'Non spécifié')}
Source: {contact_data.get('source', 'contact_form')}
IP: {contact_data.get('ip_address', 'Non disponible')}

---
Ce message a été envoyé automatiquement depuis votre formulaire de contact.
Pour répondre, utilisez l'adresse: {contact_data.get('email', '')}
    """

    return text_template.strip()

def format_timestamp(timestamp: str) -> str:
    """
    Formate le timestamp pour l'affichage
    """
    try:
        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        return dt.strftime('%d/%m/%Y à %H:%M:%S UTC')
    except:
        return timestamp