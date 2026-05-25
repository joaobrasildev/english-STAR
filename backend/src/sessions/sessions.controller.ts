import { Body, Controller, Post } from '@nestjs/common';
import type { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@Controller()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('sessions')
  createSession(@Body() body: CreateSessionDto) {
    return this.sessionsService.createSession(body);
  }
}
