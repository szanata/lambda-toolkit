resource "aws_s3_bucket" "test" {
  bucket = "test"
}

output "test" {
  value = {
    arn  = aws_s3_bucket.test.arn
    name = aws_s3_bucket.test.bucket
  }
}
