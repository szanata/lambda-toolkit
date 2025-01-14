/*
References:
- https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html
- https://stackoverflow.com/questions/58809098/remove-invalid-characters-from-message-sent-to-aws-amazon-sqs
*/
module.exports = v => v?.replace( /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/ug, '' ) // eslint-disable-line
