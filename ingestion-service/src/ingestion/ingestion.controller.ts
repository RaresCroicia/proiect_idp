import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { Course } from '../entities/course.entity';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('course')
  async ingestCourse(@Body() courseData: any): Promise<Course> {
    return this.ingestionService.ingestCourse(courseData);
  }

  @Get('course/:id')
  async getCourse(@Param('id') id: string): Promise<Course> {
    return this.ingestionService.getCourse(parseInt(id));
  }
} 