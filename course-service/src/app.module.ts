import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './course/course.module';
import { Course } from './course/entities/course.entity';
import { Lesson } from './course/entities/lesson.entity';
import { Quiz } from './course/entities/quiz.entity';
import { UserCourse } from './course/entities/user-course.entity';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    CourseModule,
  ],
})
export class AppModule {} 