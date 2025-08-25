import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let app;

export default async (req, res) => {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['https://your-frontend.vercel.app'],
      credentials: true,
    });
    await app.init();
  }
  
  return app.getHttpAdapter().getInstance()(req, res);
};
