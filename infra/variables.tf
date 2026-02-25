variable "region" {
  type    = string
  default = "ap-south-1"
}

variable "project" {
  type    = string
  default = "nexa"
}

variable "from_email" {
  description = "Verified SES sender identity (recommended: payollnexa@gmail.co)"
  type        = string
  default     = "supportnexa@gmail.com"
}

variable "to_email" {
  description = "Where contact form inquiries should be delivered"
  type        = string
  default     = "payrollnexa@gmail.com"
}

variable "client_data_bucket_name" {
  type    = string
  default = "nexa-client-data"
}

variable "master_data_bucket_name" {
  type    = string
  default = "nexa-master-data"
}
