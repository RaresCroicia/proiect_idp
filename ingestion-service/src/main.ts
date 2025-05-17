import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Debug logging
  console.log('Database URL:', configService.get('config.database.url'));
  console.log('Port:', configService.get('config.port'));
  
  const port = configService.get<number>('config.port') || 3003;
  
  await app.listen(port);
  console.log(`Ingestion service is running on port ${port}`);
}
bootstrap(); 