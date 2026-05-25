import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SessionsService } from '../sessions/sessions.service';
import type { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswersRepository } from './answers.repository';
import type { AnswerRecord, SessionSummary } from './answers.types';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sessionsService: SessionsService,
  ) {}

  async createAnswer(input: CreateAnswerDto): Promise<AnswerRecord> {
    const normalizedInput = this.validateInput(input);
    await this.sessionsService.ensureActiveSession(normalizedInput.sessionId);

    try {
      return await this.answersRepository.createAnswer(normalizedInput);
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Failed to persist answer record: ${this.describeError(error)}`,
      );
    }
  }

  async listSessions(): Promise<SessionSummary[]> {
    const answers = await this.answersRepository.listAnswers();
    const sessions = new Map<string, SessionSummary>();

    for (const answer of answers) {
      const current = sessions.get(answer.sessionId);
      if (current) {
        current.answeredCount += 1;
        current.totalElapsedSeconds += answer.elapsedSeconds;
        if (answer.createdAt > current.completedAt) {
          current.completedAt = answer.createdAt;
        }
        continue;
      }

      sessions.set(answer.sessionId, {
        sessionId: answer.sessionId,
        answeredCount: 1,
        targetSeconds: answer.targetSeconds,
        totalElapsedSeconds: answer.elapsedSeconds,
        completedAt: answer.createdAt,
      });
    }

    return [...sessions.values()].sort((left, right) =>
      right.completedAt.localeCompare(left.completedAt),
    );
  }

  async listAnswersBySession(sessionId: string): Promise<AnswerRecord[]> {
    const normalizedSessionId = sessionId.trim();
    if (!normalizedSessionId) {
      throw new BadRequestException('sessionId is required.');
    }

    const answers =
      await this.answersRepository.listAnswersBySession(normalizedSessionId);
    if (answers.length === 0) {
      throw new NotFoundException(
        `Session "${normalizedSessionId}" was not found.`,
      );
    }

    return answers;
  }

  private validateInput(input: CreateAnswerDto): CreateAnswerDto {
    const normalizedSessionId = input.sessionId?.trim();
    if (!normalizedSessionId) {
      throw new BadRequestException('sessionId is required.');
    }

    if (input.elapsedSeconds < 0) {
      throw new BadRequestException('elapsedSeconds must be zero or greater.');
    }

    return {
      ...input,
      sessionId: normalizedSessionId,
    };
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown database error';
  }
}
