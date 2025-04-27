import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Course } from './course.entity';

@Entity('user_courses')
export class UserCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  courseId: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  progress: {
    [lessonId: string]: {
      completed: boolean;
      quizScore?: number;
    };
  };

  @ManyToOne(() => Course, course => course.userCourses)
  course: Course;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 