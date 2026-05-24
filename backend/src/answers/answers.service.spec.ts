import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import type { AnswerRecord } from './answers.types';

describe('AnswersService', () => {
  const makeAnswer = (overrides: Partial<AnswerRecord> = {}): AnswerRecord => ({
    id: '1',
    sessionId: 'session-1',
    questionOrder: 1,
    questionText: 'Tell me about a challenge.',
    fullAnswer: 'Situation\nTask\nAction\nResult',
    targetSeconds: 120,
    elapsedSeconds: 135,
    createdAt: '2026-05-24T20:00:00.000Z',
    updatedAt: '2026-05-24T20:00:00.000Z',
    ...overrides,
  });

  const repository = {
    createAnswer: jest.fn(),
    listAnswers: jest.fn(),
    listAnswersBySession: jest.fn(),
  };

  let service: AnswersService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AnswersService(repository);
  });

  it('returns a descriptive error when sessionId is missing', async () => {
    await expect(
      service.createAnswer({
        sessionId: '',
        questionOrder: 1,
        questionText: 'Question',
        fullAnswer: 'Answer',
        targetSeconds: 60,
        elapsedSeconds: 10,
      }),
    ).rejects.toThrow(new BadRequestException('sessionId is required.'));
  });

  it('rejects negative elapsedSeconds values', async () => {
    await expect(
      service.createAnswer({
        sessionId: 'session-1',
        questionOrder: 1,
        questionText: 'Question',
        fullAnswer: 'Answer',
        targetSeconds: 60,
        elapsedSeconds: -1,
      }),
    ).rejects.toThrow(
      new BadRequestException('elapsedSeconds must be zero or greater.'),
    );
  });

  it('returns grouped totals by sessionId', async () => {
    repository.listAnswers.mockResolvedValue([
      makeAnswer({
        sessionId: 'session-2',
        elapsedSeconds: 70,
        targetSeconds: 90,
        createdAt: '2026-05-24T22:00:00.000Z',
      }),
      makeAnswer({
        sessionId: 'session-1',
        questionOrder: 1,
        elapsedSeconds: 60,
        createdAt: '2026-05-24T20:00:00.000Z',
      }),
      makeAnswer({
        sessionId: 'session-1',
        questionOrder: 2,
        elapsedSeconds: 75,
        createdAt: '2026-05-24T21:00:00.000Z',
      }),
    ]);

    await expect(service.listSessions()).resolves.toEqual([
      {
        sessionId: 'session-2',
        answeredCount: 1,
        targetSeconds: 90,
        totalElapsedSeconds: 70,
        completedAt: '2026-05-24T22:00:00.000Z',
      },
      {
        sessionId: 'session-1',
        answeredCount: 2,
        targetSeconds: 120,
        totalElapsedSeconds: 135,
        completedAt: '2026-05-24T21:00:00.000Z',
      },
    ]);
  });

  it('wraps persistence errors with explicit backend context', async () => {
    repository.createAnswer.mockRejectedValue(new Error('insert failed'));

    await expect(
      service.createAnswer({
        sessionId: 'session-1',
        questionOrder: 1,
        questionText: 'Question',
        fullAnswer: 'Answer',
        targetSeconds: 60,
        elapsedSeconds: 10,
      }),
    ).rejects.toThrow(
      new InternalServerErrorException(
        'Failed to persist answer record: insert failed',
      ),
    );
  });

  it('throws not found when a session has no saved answers', async () => {
    repository.listAnswersBySession.mockResolvedValue([]);

    await expect(
      service.listAnswersBySession('missing-session'),
    ).rejects.toThrow(
      new NotFoundException('Session "missing-session" was not found.'),
    );
  });
});
