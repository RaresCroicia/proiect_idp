import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Quiz } from './quiz.entity';
import { UserProgress } from './user-progress.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  duration: number;

  @Column()
  videoUrl: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Course, course => course.lessons)
  course: Course;

  @OneToMany(() => Quiz, quiz => quiz.lesson)
  quizzes: Quiz[];

  @OneToMany(() => UserProgress, progress => progress.lesson)
  progress: UserProgress[];
} 