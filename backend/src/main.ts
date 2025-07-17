import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/');
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true); // ⚠️ No recomendado en producción
    },
    credentials: true,
  });

  app.use(cookieParser());

  // ✅ Servir archivos estáticos desde la carpeta 'uploads/recurso'
  app.use('/uploads/recurso', express.static(join(__dirname, '..', 'uploads', 'recurso')));
  app.use('/uploads/historial', express.static(join(__dirname, '..', 'uploads', 'historial')));

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
