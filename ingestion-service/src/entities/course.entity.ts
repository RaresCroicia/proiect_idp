import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';
import { UserProgress } from './user-progress.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column()
  imageUrl: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  enrollments: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  instructor: User;

  @OneToMany(() => Lesson, lesson => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => UserProgress, progress => progress.lesson)
  userProgress: UserProgress[];
} 