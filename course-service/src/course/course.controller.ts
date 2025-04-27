import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async createCourse(@Body() courseData: Partial<Course>): Promise<Course> {
    return this.courseService.createCourse(courseData);
  }

  @Get()
  async findAllCourses(): Promise<Course[]> {
    return this.courseService.findAllCourses();
  }

  @Get(':id')
  async findCourseById(@Param('id') id: string): Promise<Course> {
    return this.courseService.findCourseById(id);
  }

  @Put(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() courseData: Partial<Course>,
  ): Promise<Course> {
    return this.courseService.updateCourse(id, courseData);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string): Promise<void> {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/enroll')
  async enrollUser(
    @Param('id') courseId: string,
    @Body('userId') userId: string,
  ): Promise<Course> {
    return this.courseService.enrollUser(courseId, userId);
  }

  @Post(':id/unenroll')
  async unenrollUser(
    @Param('id') courseId: string,
    @Body('userId') userId: string,
  ): Promise<Course> {
    return this.courseService.unenrollUser(courseId, userId);
  }

  @Post(':id/lessons/:lessonId/quizzes/:quizId/submit')
  async submitQuiz(
    @Param('id') courseId: string,
    @Param('lessonId') lessonId: string,
    @Param('quizId') quizId: string,
    @Body('userId') userId: string,
    @Body('answers') answers: number[],
  ): Promise<{ score: number; passed: boolean }> {
    return this.courseService.submitQuiz(
      courseId,
      lessonId,
      quizId,
      userId,
      answers,
    );
  }
} 