import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [AnswersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
