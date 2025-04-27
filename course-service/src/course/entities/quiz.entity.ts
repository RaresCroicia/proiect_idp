import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('jsonb')
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];

  @Column({ default: 0 })
  passingScore: number;

  @ManyToOne(() => Lesson, lesson => lesson.quizzes)
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 