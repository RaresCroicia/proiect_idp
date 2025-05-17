import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { UserProgress } from '../entities/user-progress.entity';
import { Quiz } from '../entities/quiz.entity';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { Lesson } from '../entities/lesson.entity';
import { QuizAnswer } from '../entities/quiz-answer.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(UserProgress)
    private readonly userProgressRepository: Repository<UserProgress>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private readonly quizQuestionRepository: Repository<QuizQuestion>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(QuizAnswer)
    private readonly quizAnswerRepository: Repository<QuizAnswer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const course = this.courseRepository.create(courseData);
    return this.courseRepository.save(course);
  }

  async findAllCourses(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['lessons', 'lessons.quizzes', 'lessons.quizzes.questions'],
    });
  }

  async findCourseById(id: string): Promise<Course> {
    return this.courseRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['lessons', 'lessons.quizzes', 'lessons.quizzes.questions'],
    });
  }

  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    await this.courseRepository.update(parseInt(id), courseData);
    return this.findCourseById(id);
  }

  async deleteCourse(id: string): Promise<void> {
    await this.courseRepository.delete(parseInt(id));
  }

  async enrollUser(courseId: string, userId: string): Promise<Course> {
    const course = await this.findCourseById(courseId);
    const user = await this.userRepository.findOne({ where: { id: parseInt(userId) } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const progress = this.userProgressRepository.create({
      user,
      lesson: course.lessons[0], // Enroll in first lesson
      isCompleted: false,
    });
    await this.userProgressRepository.save(progress);
    return course;
  }

  async unenrollUser(courseId: string, userId: string): Promise<Course> {
    const course = await this.findCourseById(courseId);
    await this.userProgressRepository.delete({ 
      user: { id: parseInt(userId) }, 
      lesson: { course: { id: parseInt(courseId) } }
    });
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
      where: { id: parseInt(quizId) },
      relations: ['questions', 'questions.answers'],
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    for (let i = 0; i < totalQuestions; i++) {
      const question = quiz.questions[i];
      const userAnswer = answers[i];
      const correctAnswer = question.answers.findIndex(answer => answer.isCorrect);

      if (userAnswer === correctAnswer) {
        score += question.points;
      }
    }

    const passed = score >= quiz.passingScore;

    // Update user progress
    const progress = await this.userProgressRepository.findOne({
      where: {
        user: { id: parseInt(userId) },
        lesson: { id: parseInt(lessonId) }
      }
    });

    if (progress) {
      progress.isCompleted = passed;
      await this.userProgressRepository.save(progress);
    }

    return { score, passed };
  }

  async ingestCourse(courseData: any): Promise<Course> {
    const course = this.courseRepository.create({
      title: courseData.title,
      description: courseData.description,
      author: courseData.author,
      imageUrl: courseData.imageUrl,
      price: courseData.price,
    });

    await this.courseRepository.save(course);

    if (courseData.lessons) {
      for (const lessonData of courseData.lessons) {
        const lesson = this.lessonRepository.create({
          title: lessonData.title,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
          order: lessonData.order,
          course: course,
        });

        await this.lessonRepository.save(lesson);

        if (lessonData.quiz) {
          const quiz = this.quizRepository.create({
            title: lessonData.quiz.title,
            passingScore: lessonData.quiz.passingScore,
            lesson: lesson,
          });

          await this.quizRepository.save(quiz);

          if (lessonData.quiz.questions) {
            for (const questionData of lessonData.quiz.questions) {
              const question = this.quizQuestionRepository.create({
                question: questionData.question,
                points: questionData.points,
                quiz: quiz,
              });

              await this.quizQuestionRepository.save(question);

              if (questionData.answers) {
                for (const answerData of questionData.answers) {
                  const answer = this.quizAnswerRepository.create({
                    text: answerData.answer,
                    isCorrect: answerData.isCorrect,
                    question: question,
                  });

                  await this.quizAnswerRepository.save(answer);
                }
              }
            }
          }
        }
      }
    }

    return this.courseRepository.findOne({
      where: { id: course.id },
      relations: ['lessons', 'lessons.quizzes', 'lessons.quizzes.questions', 'lessons.quizzes.questions.answers'],
    });
  }

  async getCourse(id: number): Promise<Course> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['lessons', 'lessons.quizzes', 'lessons.quizzes.questions'],
    });
  }
} 