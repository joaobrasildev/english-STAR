import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  const repository = {
    createSession: jest.fn(),
    findSessionById: jest.fn(),
  };

  let service: SessionsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new SessionsService(repository);
  });

  it('creates a persisted practice session for valid input', async () => {
    repository.createSession.mockResolvedValue({
      sessionId: 'session-1',
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 120,
      status: 'active',
      createdAt: '2026-05-25T18:00:00.000Z',
      updatedAt: '2026-05-25T18:00:00.000Z',
    });

    await expect(
      service.createSession({
        rawQuestionBlock: '1. Tell me about yourself',
        parsedQuestions: ['Tell me about yourself'],
        targetSeconds: 120,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        sessionId: 'session-1',
        status: 'active',
      }),
    );
  });

  it('rejects empty parsedQuestions arrays', async () => {
    await expect(
      service.createSession({
        rawQuestionBlock: '1. Tell me about yourself',
        parsedQuestions: [],
        targetSeconds: 120,
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'parsedQuestions must contain at least one question.',
      ),
    );
  });

  it('wraps repository errors with explicit backend context', async () => {
    repository.createSession.mockRejectedValue(new Error('insert failed'));

    await expect(
      service.createSession({
        rawQuestionBlock: '1. Tell me about yourself',
        parsedQuestions: ['Tell me about yourself'],
        targetSeconds: 120,
      }),
    ).rejects.toThrow(
      new InternalServerErrorException(
        'Failed to persist practice session: insert failed',
      ),
    );
  });

  it('rejects unknown sessions when answers validate against persisted sessions', async () => {
    repository.findSessionById.mockResolvedValue(null);

    await expect(
      service.ensureActiveSession('missing-session'),
    ).rejects.toThrow(
      new NotFoundException('Session "missing-session" was not found.'),
    );
  });

  it('rejects inactive persisted sessions', async () => {
    repository.findSessionById.mockResolvedValue({
      sessionId: 'session-1',
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 120,
      status: 'completed',
      createdAt: '2026-05-25T18:00:00.000Z',
      updatedAt: '2026-05-25T18:00:00.000Z',
    });

    await expect(service.ensureActiveSession('session-1')).rejects.toThrow(
      new BadRequestException('Session "session-1" is not active.'),
    );
  });
});
