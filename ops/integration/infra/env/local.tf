provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    athena     = "http://localhost:4566"
    cloudwatch = "http://localhost:4566"
    dynamodb   = "http://localhost:4566"
    glue       = "http://localhost:4566"
    iam        = "http://localhost:4566"
    lambda     = "http://localhost:4566"
    logs       = "http://localhost:4566"
    s3         = "http://localhost:4566"
    sesv2      = "http://localhost:4566"
    sns        = "http://localhost:4566"
    sqs        = "http://localhost:4566"
    ssm        = "http://localhost:4566"
    sts        = "http://localhost:4566"
  }
}

module "s3" {
  source = "../modules/s3"
}

output "test_bucket" {
  value = module.s3.test.name
}
