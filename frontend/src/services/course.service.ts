import { courseApi } from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  isPublished: boolean;
  lessons: Lesson[];
  userCourses: UserCourse[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  quizzes: Quiz[];
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  passingScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserCourse {
  id: string;
  userId: string;
  courseId: string;
  isCompleted: boolean;
  progress: {
    [lessonId: string]: {
      completed: boolean;
      quizScore?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  instructorId: string;
  isPublished?: boolean;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  id: string;
}

export interface QuizSubmission {
  userId: string;
  answers: number[];
}

export interface QuizResult {
  score: number;
  passed: boolean;
}

class CourseService {
  async getAllCourses(): Promise<Course[]> {
    const response = await courseApi.get<Course[]>('/courses');
    return response.data;
  }

  async getCourseById(id: string): Promise<Course> {
    const response = await courseApi.get<Course>(`/courses/${id}`);
    return response.data;
  }

  async createCourse(data: CreateCourseData): Promise<Course> {
    const response = await courseApi.post<Course>('/courses', data);
    return response.data;
  }

  async updateCourse(data: UpdateCourseData): Promise<Course> {
    const response = await courseApi.put<Course>(`/courses/${data.id}`, data);
    return response.data;
  }

  async deleteCourse(id: string): Promise<void> {
    await courseApi.delete(`/courses/${id}`);
  }

  async enrollUser(courseId: string, userId: string): Promise<Course> {
    const response = await courseApi.post<Course>(`/courses/${courseId}/enroll`, { userId });
    return response.data;
  }

  async unenrollUser(courseId: string, userId: string): Promise<Course> {
    const response = await courseApi.post<Course>(`/courses/${courseId}/unenroll`, { userId });
    return response.data;
  }

  async submitQuiz(
    courseId: string,
    lessonId: string,
    quizId: string,
    submission: QuizSubmission
  ): Promise<QuizResult> {
    const response = await courseApi.post<QuizResult>(
      `/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submit`,
      submission
    );
    return response.data;
  }
}

export const courseService = new CourseService(); 
 