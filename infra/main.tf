terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.4.0"
    }
}
}

provider "aws" {
  region = var.region
}

data "aws_caller_identity" "me" {}

locals {
  name_prefix = "${var.project}-portal"
}

############################
# S3 Buckets
############################
resource "aws_s3_bucket" "client_data" {
  bucket = var.client_data_bucket_name
}

resource "aws_s3_bucket" "master_data" {
  bucket = var.master_data_bucket_name
}

resource "aws_s3_bucket_public_access_block" "client_data" {
  bucket                  = aws_s3_bucket.client_data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "master_data" {
  bucket                  = aws_s3_bucket.master_data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "client_data" {
  bucket = aws_s3_bucket.client_data.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_versioning" "master_data" {
  bucket = aws_s3_bucket.master_data.id
  versioning_configuration { status = "Enabled" }
}

############################
# Cognito User Pool (Client login)
############################
resource "aws_cognito_user_pool" "pool" {
  name = "${local.name_prefix}-users"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 10
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

resource "aws_cognito_user_pool_client" "app" {
  name         = "${local.name_prefix}-app"
  user_pool_id = aws_cognito_user_pool.pool.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  supported_identity_providers = ["COGNITO"]

  # For SPA/public clients
  prevent_user_existence_errors = "ENABLED"
}

# Admin group (for payrollnexa@gmail.com)
resource "aws_cognito_user_group" "admin" {
  name         = "admin"
  user_pool_id = aws_cognito_user_pool.pool.id
  description  = "Portal administrators"
}

# (Optional) Create the admin user in Cognito (no password set here)
# You'll set password in Cognito console or via CLI.
resource "aws_cognito_user" "admin_user" {
  user_pool_id = aws_cognito_user_pool.pool.id
  username     = "payrollnexa@gmail.com"

  attributes = {
    email          = "payrollnexa@gmail.com"
    email_verified = "true"
  }

  lifecycle {
    ignore_changes = [password]
  }
}

resource "aws_cognito_user_in_group" "admin_membership" {
  user_pool_id = aws_cognito_user_pool.pool.id
  username     = aws_cognito_user.admin_user.username
  group_name   = aws_cognito_user_group.admin.name
}

############################
# SES (sender identity)
############################
resource "aws_ses_email_identity" "from" {
  email = var.from_email
}

############################
# IAM for Lambdas
############################
resource "aws_iam_role" "lambda_role" {
  name = "${local.name_prefix}-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "lambda.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "basic_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_policy" {
  name = "${local.name_prefix}-lambda-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      # SES send
      {
        Effect   = "Allow",
        Action   = ["ses:SendEmail", "ses:SendRawEmail"],
        Resource = "*"
      },
      # S3 (client uploads + master profile)
      {
        Effect = "Allow",
        Action = ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
        Resource = [
          aws_s3_bucket.client_data.arn,
          "${aws_s3_bucket.client_data.arn}/*",
          aws_s3_bucket.master_data.arn,
          "${aws_s3_bucket.master_data.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_custom" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

############################
# Package Lambdas
############################
data "archive_file" "contact_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/contact_send_email.py"
  output_path = "${path.module}/lambda/contact_send_email.zip"
}

data "archive_file" "register_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/register_profile.py"
  output_path = "${path.module}/lambda/register_profile.zip"
}

data "archive_file" "presign_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/presign_upload.py"
  output_path = "${path.module}/lambda/presign_upload.zip"
}
data "archive_file" "list_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/list_uploads.py"
  output_path = "${path.module}/lambda/list_uploads.zip"
}

data "archive_file" "download_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/download_upload.py"
  output_path = "${path.module}/lambda/download_upload.zip"
}

resource "aws_lambda_function" "contact" {
  function_name = "${local.name_prefix}-contact"
  role          = aws_iam_role.lambda_role.arn
  handler       = "contact_send_email.lambda_handler"
  runtime       = "python3.12"
  filename      = data.archive_file.contact_zip.output_path

  environment {
    variables = {
      FROM_EMAIL = var.from_email
      TO_EMAIL   = var.to_email
    }
  }
}

resource "aws_lambda_function" "register" {
  function_name = "${local.name_prefix}-register-profile"
  role          = aws_iam_role.lambda_role.arn
  handler       = "register_profile.lambda_handler"
  runtime       = "python3.12"
  filename      = data.archive_file.register_zip.output_path

  environment {
    variables = {
      MASTER_BUCKET = aws_s3_bucket.master_data.bucket
    }
  }
}

resource "aws_lambda_function" "list_uploads" {
  function_name = "${local.name_prefix}-list-uploads"
  role          = aws_iam_role.lambda_role.arn
  handler       = "list_uploads.lambda_handler"
  runtime       = "python3.12"
  filename      = data.archive_file.list_zip.output_path

  environment {
    variables = {
      CLIENT_BUCKET = aws_s3_bucket.client_data.bucket
      MASTER_BUCKET = aws_s3_bucket.master_data.bucket
    }
  }
}

resource "aws_lambda_function" "download_upload" {
  function_name = "${local.name_prefix}-download-upload"
  role          = aws_iam_role.lambda_role.arn
  handler       = "download_upload.lambda_handler"
  runtime       = "python3.12"
  filename      = data.archive_file.download_zip.output_path

  environment {
    variables = {
      CLIENT_BUCKET = aws_s3_bucket.client_data.bucket
      MASTER_BUCKET = aws_s3_bucket.master_data.bucket
    }
  }
}


resource "aws_lambda_function" "presign" {
  function_name = "${local.name_prefix}-presign-upload"
  role          = aws_iam_role.lambda_role.arn
  handler       = "presign_upload.lambda_handler"
  runtime       = "python3.12"
  filename      = data.archive_file.presign_zip.output_path

  environment {
    variables = {
      CLIENT_BUCKET = aws_s3_bucket.client_data.bucket
      MASTER_BUCKET = aws_s3_bucket.master_data.bucket
    }
  }
}

############################
# HTTP API Gateway + Cognito JWT authorizer
############################
resource "aws_apigatewayv2_api" "api" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"] # tighten later to https://nexapayroll.com
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type", "authorization"]
    max_age       = 3600
  }
}

# CORS for browser-based presigned uploads to client data bucket
resource "aws_s3_bucket_cors_configuration" "client_data" {
  bucket = aws_s3_bucket.client_data.id

  cors_rule {
    allowed_origins = ["https://nexapayroll.com", "http://localhost:3000"]
    allowed_methods = ["PUT", "GET", "HEAD"]
    allowed_headers = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_apigatewayv2_integration" "list_uploads" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.list_uploads.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "download_upload" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.download_upload.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "${local.name_prefix}-jwt"

  jwt_configuration {
    issuer   = "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.pool.id}"
    audience = [aws_cognito_user_pool_client.app.id]
  }
}

resource "aws_apigatewayv2_integration" "contact" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.contact.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "register" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.register.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "presign" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.presign.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "list_uploads" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /uploads"
  target    = "integrations/${aws_apigatewayv2_integration.list_uploads.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "download_upload" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /download-url"
  target    = "integrations/${aws_apigatewayv2_integration.download_upload.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

# Public contact endpoint
resource "aws_apigatewayv2_route" "contact" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.contact.id}"
}

# Protected: save client profile to S3 (after login)
resource "aws_apigatewayv2_route" "register" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /profile"
  target    = "integrations/${aws_apigatewayv2_integration.register.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

# Protected: get presigned upload URL
resource "aws_apigatewayv2_route" "presign" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /upload-url"
  target    = "integrations/${aws_apigatewayv2_integration.presign.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

############################
# Lambda permissions for API Gateway
############################
resource "aws_lambda_permission" "allow_contact" {
  statement_id  = "AllowApiInvokeContact"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_register" {
  statement_id  = "AllowApiInvokeRegister"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_presign" {
  statement_id  = "AllowApiInvokePresign"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.presign.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_list_uploads" {
  statement_id  = "AllowApiInvokeListUploads"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_uploads.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_download_upload" {
  statement_id  = "AllowApiInvokeDownloadUpload"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.download_upload.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

