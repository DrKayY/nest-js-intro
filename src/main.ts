import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  try {
    await app.listen(port);
    logger.log(`Application now listening on port: ${port}`);
  } catch (error) {
    logger.error(`Application failed to start up. Info: ${error}`);
  }
}
bootstrap();
