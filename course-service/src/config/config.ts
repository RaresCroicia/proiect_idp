import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3002,
  database: {
    url: process.env.DATABASE_URL,
  },
  environment: process.env.NODE_ENV || 'development',
})); 