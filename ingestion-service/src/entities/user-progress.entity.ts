import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastAccessed: Date;

  @ManyToOne(() => User, user => user.progress)
  user: User;

  @ManyToOne(() => Lesson, lesson => lesson.progress)
  lesson: Lesson;
} 