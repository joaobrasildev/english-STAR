import { Test, TestingModule } from '@nestjs/testing';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

describe('AnswersController', () => {
  let controller: AnswersController;

  const answersService = {
    createAnswer: jest.fn(),
    listSessions: jest.fn(),
    listAnswersBySession: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AnswersController],
      providers: [
        {
          provide: AnswersService,
          useValue: answersService,
        },
      ],
    }).compile();

    controller = moduleRef.get(AnswersController);
  });

  it('delegates answer creation to the service', async () => {
    const payload = {
      sessionId: 'session-1',
      questionOrder: 1,
      questionText: 'Question',
      fullAnswer: 'Answer',
      targetSeconds: 90,
      elapsedSeconds: 110,
    };
    answersService.createAnswer.mockResolvedValue({ id: 'record-1' });

    await expect(controller.createAnswer(payload)).resolves.toEqual({
      id: 'record-1',
    });
    expect(answersService.createAnswer).toHaveBeenCalledWith(payload);
  });

  it('returns session summaries from the service', async () => {
    answersService.listSessions.mockResolvedValue([
      { sessionId: 'session-1', answeredCount: 1 },
    ]);

    await expect(controller.listSessions()).resolves.toEqual([
      { sessionId: 'session-1', answeredCount: 1 },
    ]);
  });

  it('returns answers for a specific session', async () => {
    answersService.listAnswersBySession.mockResolvedValue([{ id: 'record-1' }]);

    await expect(controller.listAnswersBySession('session-1')).resolves.toEqual(
      [{ id: 'record-1' }],
    );
    expect(answersService.listAnswersBySession).toHaveBeenCalledWith(
      'session-1',
    );
  });

  it('preserves CreateAnswerDto metadata for the request body parameter', () => {
    expect(
      Reflect.getMetadata('design:paramtypes', AnswersController.prototype, 'createAnswer'),
    ).toEqual([CreateAnswerDto]);
  });
});
