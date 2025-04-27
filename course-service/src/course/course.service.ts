import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Quiz } from './entities/quiz.entity';
import { UserCourse } from './entities/user-course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(UserCourse)
    private userCourseRepository: Repository<UserCourse>,
  ) {}

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const course = this.courseRepository.create(courseData);
    return this.courseRepository.save(course);
  }

  async findAllCourses(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['lessons', 'lessons.quizzes'],
    });
  }

  async findCourseById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lessons', 'lessons.quizzes'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    const course = await this.findCourseById(id);
    Object.assign(course, courseData);
    return this.courseRepository.save(course);
  }

  async deleteCourse(id: string): Promise<void> {
    const course = await this.findCourseById(id);
    await this.courseRepository.remove(course);
  }

  async enrollUser(courseId: string, userId: string): Promise<Course> {
    const course = await this.findCourseById(courseId);
    const userCourse = this.userCourseRepository.create({
      courseId,
      userId,
    });
    await this.userCourseRepository.save(userCourse);
    return course;
  }

  async unenrollUser(courseId: string, userId: string): Promise<Course> {
    const course = await this.findCourseById(courseId);
    const userCourse = await this.userCourseRepository.findOne({
      where: { courseId, userId },
    });
    if (userCourse) {
      await this.userCourseRepository.remove(userCourse);
    }
    return course;
  }

  async submitQuiz(
    courseId: string,
    lessonId: string,
    quizId: string,
    userId: string,
    answers: number[],
  ): Promise<{ score: number; passed: boolean }> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, lesson: { id: lessonId, course: { id: courseId } } },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const score = this.calculateQuizScore(quiz.questions, answers);
    const passed = score >= quiz.passingScore;

    const userCourse = await this.userCourseRepository.findOne({
      where: { courseId, userId },
    });
    if (userCourse) {
      userCourse.progress = {
        ...userCourse.progress,
        [lessonId]: {
          completed: passed,
          quizScore: score,
        },
      };
      await this.userCourseRepository.save(userCourse);
    }

    return { score, passed };
  }

  private calculateQuizScore(
    questions: { correctAnswer: number }[],
    answers: number[],
  ): number {
    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index].correctAnswer,
    ).length;
    return (correctAnswers / questions.length) * 100;
  }
} 