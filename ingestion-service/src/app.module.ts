import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionModule } from './ingestion/ingestion.module';
import config from './config/config';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { User } from './entities/user.entity';
import { UserProgress } from './entities/user-progress.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('config.database.url'),
        entities: [Course, Lesson, Quiz, QuizQuestion, QuizAnswer, User, UserProgress],
        synchronize: true, // Set to false in production
        logging: true, // Add this to see SQL queries in console
      }),
      inject: [ConfigService],
    }),
    IngestionModule,
  ],
})
export class AppModule {} 