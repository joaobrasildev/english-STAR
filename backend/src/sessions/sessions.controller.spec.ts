import { Test, TestingModule } from '@nestjs/testing';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  const sessionsService = {
    createSession: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SessionsService,
          useValue: sessionsService,
        },
      ],
    }).compile();

    controller = moduleRef.get(SessionsController);
  });

  it('delegates session creation to the service', async () => {
    const payload = {
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 120,
    };
    sessionsService.createSession.mockResolvedValue({ sessionId: 'session-1' });

    await expect(controller.createSession(payload)).resolves.toEqual({
      sessionId: 'session-1',
    });
    expect(sessionsService.createSession).toHaveBeenCalledWith(payload);
  });

  it('preserves CreateSessionDto metadata for the request body parameter', () => {
    expect(
      Reflect.getMetadata('design:paramtypes', SessionsController.prototype, 'createSession'),
    ).toEqual([CreateSessionDto]);
  });
});
