import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { CreateSessionDto } from './dto/create-session.dto';
import { SessionsRepository } from './sessions.repository';
import type { PracticeSessionRecord } from './sessions.types';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async createSession(input: CreateSessionDto): Promise<PracticeSessionRecord> {
    this.validateInput(input);

    try {
      return await this.sessionsRepository.createSession(input);
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Failed to persist practice session: ${this.describeError(error)}`,
      );
    }
  }

  async ensureActiveSession(sessionId: string): Promise<PracticeSessionRecord> {
    const normalizedSessionId = sessionId.trim();
    if (!normalizedSessionId) {
      throw new BadRequestException('sessionId is required.');
    }

    const session = await this.readSession(normalizedSessionId);
    if (!session) {
      throw new NotFoundException(
        `Session "${normalizedSessionId}" was not found.`,
      );
    }

    if (session.status !== 'active') {
      throw new BadRequestException(
        `Session "${normalizedSessionId}" is not active.`,
      );
    }

    return session;
  }

  private validateInput(input: CreateSessionDto): void {
    if (!input.rawQuestionBlock?.trim()) {
      throw new BadRequestException('rawQuestionBlock is required.');
    }

    if (input.parsedQuestions.length === 0) {
      throw new BadRequestException(
        'parsedQuestions must contain at least one question.',
      );
    }

    if (input.parsedQuestions.some((question) => !question.trim())) {
      throw new BadRequestException(
        'parsedQuestions cannot contain empty items.',
      );
    }

    if (input.targetSeconds < 1) {
      throw new BadRequestException('targetSeconds must be greater than zero.');
    }
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown database error';
  }

  private async readSession(
    sessionId: string,
  ): Promise<PracticeSessionRecord | null> {
    try {
      return await this.sessionsRepository.findSessionById(sessionId);
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Failed to read practice session: ${this.describeError(error)}`,
      );
    }
  }
}
