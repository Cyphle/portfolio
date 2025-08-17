# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "contact-form"
}

variable "notification_email" {
  description = "Email for notifications"
  type        = string
}

variable "domain_name" {
  description = "Domain name for CORS"
  type        = string
  default     = "*"
}

# Provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# S3 Bucket pour stocker les messages de contact
resource "aws_s3_bucket" "contact_forms" {
  bucket = "${var.project_name}-contact-forms-${random_id.bucket_suffix.hex}"
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_versioning" "contact_forms" {
  bucket = aws_s3_bucket.contact_forms.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" {
  bucket = aws_s3_bucket.contact_forms.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "contact_forms" {
  bucket = aws_s3_bucket.contact_forms.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# SNS Topic pour les notifications
resource "aws_sns_topic" "contact_notifications" {
  name = "${var.project_name}-contact-notifications"
}

resource "aws_sns_topic_subscription" "email_notification" {
  topic_arn = aws_sns_topic.contact_notifications.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.email_sender.arn
}

# IAM Role pour Lambda de validation
resource "aws_iam_role" "contact_validator_role" {
  name = "${var.project_name}-contact-validator-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "contact_validator_policy" {
  name = "${var.project_name}-contact-validator-policy"
  role = aws_iam_role.contact_validator_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.contact_forms.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = aws_sns_topic.contact_notifications.arn
      }
    ]
  })
}

# IAM Role pour Lambda d'envoi d'email
resource "aws_iam_role" "email_sender_role" {
  name = "${var.project_name}-email-sender-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "email_sender_policy" {
  name = "${var.project_name}-email-sender-policy"
  role = aws_iam_role.email_sender_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      }
    ]
  })
}

# Lambda de validation et traitement
data "archive_file" "contact_validator_zip" {
  type        = "zip"
  output_path = "contact_validator.zip"
  source {
    content = templatefile("${path.module}/lambda/contact_validator.py", {
      bucket_name = aws_s3_bucket.contact_forms.bucket
      sns_topic_arn = aws_sns_topic.contact_notifications.arn
    })
    filename = "lambda_function.py"
  }
}

resource "aws_lambda_function" "contact_validator" {
  filename         = data.archive_file.contact_validator_zip.output_path
  function_name    = "${var.project_name}-contact-validator"
  role            = aws_iam_role.contact_validator_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.contact_validator_zip.output_base64sha256
  runtime         = "python3.9"
  timeout         = 30

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.contact_forms.bucket
      SNS_TOPIC_ARN = aws_sns_topic.contact_notifications.arn
      ALLOWED_ORIGIN = var.domain_name
    }
  }
}

# Lambda d'envoi d'email
data "archive_file" "email_sender_zip" {
  type        = "zip"
  output_path = "email_sender.zip"
  source {
    content = templatefile("${path.module}/lambda/email_sender.py", {
      notification_email = var.notification_email
    })
    filename = "lambda_function.py"
  }
}

resource "aws_lambda_function" "email_sender" {
  filename         = data.archive_file.email_sender_zip.output_path
  function_name    = "${var.project_name}-email-sender"
  role            = aws_iam_role.email_sender_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = data.archive_file.email_sender_zip.output_base64sha256
  runtime         = "python3.9"
  timeout         = 30

  environment {
    variables = {
      NOTIFICATION_EMAIL = var.notification_email
    }
  }
}

# Permission pour SNS d'invoquer la Lambda
resource "aws_lambda_permission" "sns_invoke_email_sender" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_sender.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.contact_notifications.arn
}

# API Gateway
resource "aws_api_gateway_rest_api" "contact_api" {
  name        = "${var.project_name}-api"
  description = "Contact form API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "contact_resource" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  parent_id   = aws_api_gateway_rest_api.contact_api.root_resource_id
  path_part   = "contact"
}

# OPTIONS method pour CORS
resource "aws_api_gateway_method" "contact_options" {
  rest_api_id   = aws_api_gateway_rest_api.contact_api.id
  resource_id   = aws_api_gateway_resource.contact_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "contact_options_integration" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact_resource.id
  http_method = aws_api_gateway_method.contact_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "contact_options_response" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact_resource.id
  http_method = aws_api_gateway_method.contact_options.http_method
  status_code = "200"

  response_headers = {
    "Access-Control-Allow-Headers" = true
    "Access-Control-Allow-Methods" = true
    "Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "contact_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact_resource.id
  http_method = aws_api_gateway_method.contact_options.http_method
  status_code = aws_api_gateway_method_response.contact_options_response.status_code

  response_headers = {
    "Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'"
    "Access-Control-Allow-Origin"  = "'${var.domain_name}'"
  }
}

# POST method
resource "aws_api_gateway_method" "contact_post" {
  rest_api_id   = aws_api_gateway_rest_api.contact_api.id
  resource_id   = aws_api_gateway_resource.contact_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "contact_post_integration" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact_resource.id
  http_method = aws_api_gateway_method.contact_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.contact_validator.invoke_arn
}

resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact_validator.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.contact_api.execution_arn}/*/*"
}

# Deployment
resource "aws_api_gateway_deployment" "contact_api_deployment" {
  depends_on = [
    aws_api_gateway_method.contact_post,
    aws_api_gateway_integration.contact_post_integration,
    aws_api_gateway_method.contact_options,
    aws_api_gateway_integration.contact_options_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  stage_name  = var.environment
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "contact_validator_logs" {
  name              = "/aws/lambda/${aws_lambda_function.contact_validator.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "email_sender_logs" {
  name              = "/aws/lambda/${aws_lambda_function.email_sender.function_name}"
  retention_in_days = 14
}

# Outputs
output "api_gateway_url" {
  value = "${aws_api_gateway_deployment.contact_api_deployment.invoke_url}/contact"
  description = "URL de l'API Gateway pour le formulaire de contact"
}

output "s3_bucket_name" {
  value = aws_s3_bucket.contact_forms.bucket
  description = "Nom du bucket S3 pour les messages de contact"
}

output "sns_topic_arn" {
  value = aws_sns_topic.contact_notifications.arn
  description = "ARN du topic SNS pour les notifications"
}