import type { IResult } from 'mssql';
import { PRACTICE_SESSIONS_SCHEMA_SQL } from './session-records.schema';
import { SessionsRepository } from './sessions.repository';

describe('SessionsRepository', () => {
  const query = jest.fn<Promise<IResult<unknown>>, [string]>();
  const batch = jest.fn<Promise<IResult<unknown>>, [string]>();
  const requestContext = {} as {
    batch: typeof batch;
    input: typeof input;
    query: typeof query;
  };
  const input = jest.fn(() => requestContext);
  requestContext.batch = batch;
  requestContext.input = input;
  requestContext.query = query;
  const request = jest.fn(() => requestContext);
  const pool = {
    request,
  };

  let repository: SessionsRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    input.mockImplementation(() => requestContext);
    request.mockImplementation(() => requestContext);
    repository = new SessionsRepository(pool);
  });

  it('creates the session schema once before inserting records', async () => {
    query.mockResolvedValueOnce({
      recordset: [
        {
          sessionId: 'session-1',
          rawQuestionBlock: '1. Tell me about yourself',
          parsedQuestions: JSON.stringify(['Tell me about yourself']),
          targetSeconds: 120,
          status: 'active',
          createdAt: new Date('2026-05-25T18:00:00.000Z'),
          updatedAt: new Date('2026-05-25T18:00:00.000Z'),
        },
      ],
    } as IResult<unknown>);

    const result = await repository.createSession({
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 120,
    });

    expect(batch).toHaveBeenCalledWith(PRACTICE_SESSIONS_SCHEMA_SQL);
    expect(input).toHaveBeenCalledWith(
      'parsedQuestions',
      expect.anything(),
      JSON.stringify(['Tell me about yourself']),
    );
    expect(result).toEqual({
      sessionId: 'session-1',
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 120,
      status: 'active',
      createdAt: '2026-05-25T18:00:00.000Z',
      updatedAt: '2026-05-25T18:00:00.000Z',
    });
  });
});
