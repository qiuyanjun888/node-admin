export class Result<T = any> {
  success: boolean
  code: number
  message?: string
  data?: T

  constructor(success: boolean, code: number, message: string, data: T) {
    this.success = success
    this.code = code
    this.message = message
    this.data = data
  }

  static success<T>(data: T, message = 'success'): Result<T> {
    return new Result(true, 200, message, data)
  }

  static error(message = 'error', code = 500): Result {
    return new Result(false, code, message, null)
  }
}
