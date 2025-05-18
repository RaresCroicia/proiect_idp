import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CourseModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {} 