/**
 * Normalizes handler return values into a consistent response format.
 * Accepts numbers, strings, arrays, or objects.
 */
export class UserResponse {
  values: [statusCode: number, body?: any, headers?: Record<string, string>, isBase64Encoded?: boolean];

  constructor(
    response?:
      | number
      | string
      | [statusCode: number, body?: any, headers?: Record<string, string>, isBase64Encoded?: boolean]
      | { statusCode: number; body?: any; headers?: Record<string, string>; isBase64Encoded?: boolean }
      | null
      | undefined
  );
}
