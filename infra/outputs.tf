output "api_base_url" {
  value = aws_apigatewayv2_api.api.api_endpoint
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "cognito_app_client_id" {
  value = aws_cognito_user_pool_client.app.id
}

output "cognito_issuer" {
  value = "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.pool.id}"
}

output "master_bucket" {
  value = aws_s3_bucket.master_data.bucket
}

output "client_bucket" {
  value = aws_s3_bucket.client_data.bucket
}
