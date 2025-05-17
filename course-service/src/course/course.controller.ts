import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() courseData: any, @Request() req) {
    return this.courseService.createCourse(courseData, req.headers.authorization.split(' ')[1]);
  }

  @Get()
  findAll(@Request() req) {
    return this.courseService.findAllCourses(req.headers.authorization.split(' ')[1]);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.courseService.findCourseById(id, req.headers.authorization.split(' ')[1]);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() courseData: any, @Request() req) {
    return this.courseService.updateCourse(id, courseData, req.headers.authorization.split(' ')[1]);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.courseService.deleteCourse(id, req.headers.authorization.split(' ')[1]);
  }

  @Post(':id/enroll')
  enrollUser(@Param('id') id: string, @Body('userId') userId: string, @Request() req) {
    return this.courseService.enrollUser(id, userId, req.headers.authorization.split(' ')[1]);
  }

  @Post(':id/unenroll')
  unenrollUser(@Param('id') id: string, @Body('userId') userId: string, @Request() req) {
    return this.courseService.unenrollUser(id, userId, req.headers.authorization.split(' ')[1]);
  }

  @Post(':id/lessons/:lessonId/quizzes/:quizId/submit')
  submitQuiz(
    @Param('id') id: string,
    @Param('lessonId') lessonId: string,
    @Param('quizId') quizId: string,
    @Body('userId') userId: string,
    @Body('answers') answers: number[],
    @Request() req,
  ) {
    return this.courseService.submitQuiz(
      id,
      lessonId,
      quizId,
      userId,
      answers,
      req.headers.authorization.split(' ')[1],
    );
  }
} 