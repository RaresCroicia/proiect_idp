import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  private readonly ingestionServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ingestionServiceUrl = this.configService.get<string>('config.ingestionServiceUrl') || 'http://localhost:3003';
  }

  private getHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async createCourse(courseData: Partial<Course>, token: string): Promise<Course> {
    const response = await this.httpService.axiosRef.post(
      `${this.ingestionServiceUrl}/courses`, 
      courseData,
      { headers: this.getHeaders(token) }
    );
    return response.data;
  }

  async findAllCourses(token: string): Promise<Course[]> {
    const response = await this.httpService.axiosRef.get(
      `${this.ingestionServiceUrl}/courses`,
      { headers: this.getHeaders(token) }
    );
    return response.data;
  }

  async findCourseById(id: string, token: string): Promise<Course> {
    const response = await this.httpService.axiosRef.get(
      `${this.ingestionServiceUrl}/courses/${id}`,
      { headers: this.getHeaders(token) }
    );
    return response.data;
  }

  async updateCourse(id: string, courseData: Partial<Course>, token: string): Promise<Course> {
    const response = await this.httpService.axiosRef.put(
      `${this.ingestionServiceUrl}/courses/${id}`,
      courseData,
      { headers: this.getHeaders(token) }
    );
    return response.data;
  }

  async deleteCourse(id: string, token: string): Promise<void> {
    await this.httpService.axiosRef.delete(
      `${this.ingestionServiceUrl}/courses/${id}`,
      { headers: this.getHeaders(token) }
    );
  }

  async enrollUser(courseId: string, userId: string, token: string): Promise<Course> {
    const response = await this.httpService.axiosRef.post(
      `${this.ingestionServiceUrl}/courses/${courseId}/enroll`,
      { userId },
      { headers: this.getHeaders(token) }
    );
    return response.data;
  }

  async unenrollUser(courseId: string, userId: string, token: string): Promise<Course> {
    const response = await this.httpService.axiosRef.post(
      `${this.ingestionServiceUrl}/courses/${courseId}/unenroll`,
      { userId },
      { headers: this.getHeaders(token) }
    );
    return response.data;
  }

  async submitQuiz(
    courseId: string,
    lessonId: string,
    quizId: string,
    userId: string,
    answers: number[],
    token: string,
  ): Promise<{ score: number; passed: boolean }> {
    const response = await this.httpService.axiosRef.post(
      `${this.ingestionServiceUrl}/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submit`,
      { userId, answers },
      { headers: this.getHeaders(token) }
    );
    return response.data;
  }
} 