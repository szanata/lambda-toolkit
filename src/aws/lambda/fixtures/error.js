module.exports = {
  $metadata: {
    httpStatusCode: 200,
    requestId: '0000bbbb-0000-aaaa-0000-aaaabbbb0000',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  FunctionError: 'Unhandled',
  ExecutedVersion: '$LATEST',
  Payload: Uint8Array.from( Buffer.from( JSON.stringify( {
    errorType: 'TypeError',
    errorMessage: 'x is not a function',
    trace: [
      'TypeError: x is not a function',
      '    at module.exports.main [as handler] (/var/task/index.js:18:51)',
      '    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1089:29)'
    ]
  } ) ) ),
  StatusCode: 200
};
