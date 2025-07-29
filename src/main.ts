import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
 // const app = await NestFactory.create(AppModule);
const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ✅ Enable CORS for all origins (you can restrict later)
  app.enableCors({
     origin: '*',
    //origin: 'http://192.168.1.70:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true ,transform: true,}));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  await app.listen(process.env.PORT || 3001);
 
}
bootstrap();
