import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 1. Enable Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // 2. Enable CORS for Frontend communication
  app.enableCors()

  // 4. Global Interceptor for unified response
  app.useGlobalInterceptors(new TransformInterceptor())

  // 5. Global Filter for unified exception handling
  app.useGlobalFilters(new AllExceptionsFilter())

  // 3. Configure Swagger API Docs
  const config = new DocumentBuilder()
    .setTitle('Node Admin API')
    .setDescription('The Commodity Management System API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
