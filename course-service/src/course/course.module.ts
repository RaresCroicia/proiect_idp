import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {} 