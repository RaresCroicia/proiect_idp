import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';
import { QuizQuestion } from './quiz-question.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 0 })
  passingScore: number;

  @ManyToOne(() => Lesson, lesson => lesson.quizzes)
  lesson: Lesson;

  @OneToMany(() => QuizQuestion, question => question.quiz)
  questions: QuizQuestion[];
} 