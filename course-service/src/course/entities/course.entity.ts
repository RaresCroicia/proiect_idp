import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';
import { UserCourse } from './user-course.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  instructorId: string;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => Lesson, lesson => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => UserCourse, userCourse => userCourse.course)
  userCourses: UserCourse[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 