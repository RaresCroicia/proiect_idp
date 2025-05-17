import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  create(@Body() courseData: any) {
    return this.ingestionService.createCourse(courseData);
  }

  @Get()
  findAll() {
    return this.ingestionService.findAllCourses();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingestionService.findCourseById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() courseData: any) {
    return this.ingestionService.updateCourse(id, courseData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingestionService.deleteCourse(id);
  }

  @Post(':id/enroll')
  enrollUser(@Param('id') id: string, @Body('userId') userId: string) {
    return this.ingestionService.enrollUser(id, userId);
  }

  @Post(':id/unenroll')
  unenrollUser(@Param('id') id: string, @Body('userId') userId: string) {
    return this.ingestionService.unenrollUser(id, userId);
  }

  @Post(':id/lessons/:lessonId/quizzes/:quizId/submit')
  submitQuiz(
    @Param('id') id: string,
    @Param('lessonId') lessonId: string,
    @Param('quizId') quizId: string,
    @Body('userId') userId: string,
    @Body('answers') answers: number[],
  ) {
    return this.ingestionService.submitQuiz(id, lessonId, quizId, userId, answers);
  }
} 