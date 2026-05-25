import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AnswersModule } from './answers/answers.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [AnswersModule, SessionsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
