import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
const cors = require("cors");

async function bootstrap() {
  const corsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: process.env.BASE_URL,
    preflightContinue: false,
  };
  const app = await NestFactory.create(AppModule);
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();

