import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity';
import { Quiz } from '../entities/quiz.entity';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { QuizAnswer } from '../entities/quiz-answer.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private readonly quizQuestionRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizAnswer)
    private readonly quizAnswerRepository: Repository<QuizAnswer>,
  ) {}

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
      relations: ['lessons', 'lessons.quiz', 'lessons.quiz.questions', 'lessons.quiz.questions.answers'],
    });
  }

  async getCourse(id: number): Promise<Course> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['lessons', 'lessons.quiz', 'lessons.quiz.questions'],
    });
  }
} 