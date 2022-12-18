import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Vehicles API')
      .setVersion('1.0.0')
      .addTag('api')
      .build(),
  );
  SwaggerModule.setup('/docs', app, document);
  await app.listen(3000);
}
bootstrap();
