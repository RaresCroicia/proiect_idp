import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT || '3002', 10),
  ingestionServiceUrl: process.env.INGESTION_SERVICE_URL || 'http://188.245.104.79/ingestion',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://188.245.104.79/auth',
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
})); 