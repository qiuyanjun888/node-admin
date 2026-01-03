import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Result } from '../models/result.model'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Result<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Result<T>> {
    return next.handle().pipe(map((data: T) => Result.success(data)))
  }
}
