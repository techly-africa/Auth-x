import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Role Based Access Control APIs')
    .setDescription(
      "Welcome to the Role-Based Access Control (RBAC) API documentation. RBAC is a powerful and flexible authorization mechanism that allows you to manage and control access to your application's resources based on user roles and permissions. This API provides a straightforward way to integrate RBAC functionality into your application, enabling you to easily define and enforce access policies.",
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: process.env.GOOGLE_SERVER,
          scopes: [],
        },
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
