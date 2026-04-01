import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { swaggerConsfig } from './config/swagger/swagger.confg';
import { RequestInterceptorInterceptor } from './common/interceptors/request-interceptor.interceptor';
import { ConfigService } from '@nestjs/config';
import { ENV } from './common/types/type-orm';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { corsOptions } from './config/cors/cors-config.config';
import * as basicAuth from 'express-basic-auth';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new RequestInterceptorInterceptor());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors(corsOptions({ app }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableVersioning({ type: VersioningType.URI });
  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [config.get<string>(ENV.ADMIN)]: config.get<string>(ENV.PASSWORD_ADMIN),
      },
    })
  )
  swaggerConsfig({
    title: 'Documento practico Usuarios',
    description: 'API practica de Usuarios',
    version: '1.0',
    app,
  });
  const port = config.get<number>(ENV.PORT) ?? 3001;
  await app.listen(port);
}
void bootstrap();
