import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { Result } from '../models/result.model'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    let message = 'Internal server error'
    if (exception instanceof HttpException) {
      const res = exception.getResponse()
      message =
        typeof res === 'object' && res !== null && 'message' in (res as Record<string, unknown>)
          ? String((res as Record<string, any>).message)
          : (res as string)
    } else if (exception instanceof Error) {
      message = exception.message
    }

    // Log the error for debugging
    if (status >= 500) {
      this.logger.error(exception)
    }

    response.status(status).json(Result.error(message, status))
  }
}
