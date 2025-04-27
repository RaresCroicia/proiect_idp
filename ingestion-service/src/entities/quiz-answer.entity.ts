import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';

@Entity()
export class QuizAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => QuizQuestion, question => question.answers)
  question: QuizQuestion;
} 