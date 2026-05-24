import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnswersService } from './answers.service';
import type { CreateAnswerDto } from './dto/create-answer.dto';

@Controller()
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post('answers')
  createAnswer(@Body() body: CreateAnswerDto) {
    return this.answersService.createAnswer(body);
  }

  @Get('sessions')
  listSessions() {
    return this.answersService.listSessions();
  }

  @Get('sessions/:sessionId/answers')
  listAnswersBySession(@Param('sessionId') sessionId: string) {
    return this.answersService.listAnswersBySession(sessionId);
  }
}
