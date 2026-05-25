import { Module } from '@nestjs/common';
import { SqlServerModule } from '../database/sqlserver.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AnswersController } from './answers.controller';
import { AnswersRepository } from './answers.repository';
import { AnswersService } from './answers.service';

@Module({
  imports: [SqlServerModule, SessionsModule],
  controllers: [AnswersController],
  providers: [AnswersService, AnswersRepository],
  exports: [AnswersService],
})
export class AnswersModule {}
