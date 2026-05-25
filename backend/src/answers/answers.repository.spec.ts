import type { IResult } from 'mssql';
import { ANSWER_RECORDS_SCHEMA_SQL } from './answer-records.schema';
import { AnswersRepository } from './answers.repository';

describe('AnswersRepository', () => {
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

  let repository: AnswersRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    input.mockImplementation(() => requestContext);
    request.mockImplementation(() => requestContext);
    repository = new AnswersRepository(pool);
  });

  it('creates the schema once before inserting records', async () => {
    query.mockResolvedValueOnce({
      recordset: [
        {
          id: 'record-1',
          sessionId: 'session-1',
          questionOrder: 1,
          questionText: 'Question line 1\nQuestion line 2',
          fullAnswer: 'Answer',
          targetSeconds: 90,
          elapsedSeconds: 100,
          createdAt: new Date('2026-05-24T20:00:00.000Z'),
          updatedAt: new Date('2026-05-24T20:00:00.000Z'),
        },
      ],
    } as IResult<unknown>);

    const result = await repository.createAnswer({
      sessionId: 'session-1',
      questionOrder: 1,
      questionText: 'Question line 1\nQuestion line 2',
      fullAnswer: 'Answer',
      targetSeconds: 90,
      elapsedSeconds: 100,
    });

    expect(batch).toHaveBeenCalledWith(ANSWER_RECORDS_SCHEMA_SQL);
    expect(input).toHaveBeenCalledWith(
      'sessionId',
      expect.anything(),
      'session-1',
    );
    expect(result).toEqual({
      id: 'record-1',
      sessionId: 'session-1',
      questionOrder: 1,
      questionText: 'Question line 1\nQuestion line 2',
      fullAnswer: 'Answer',
      targetSeconds: 90,
      elapsedSeconds: 100,
      createdAt: '2026-05-24T20:00:00.000Z',
      updatedAt: '2026-05-24T20:00:00.000Z',
    });
  });

  it('lists answers ordered by session query result', async () => {
    query.mockResolvedValueOnce({
      recordset: [
        {
          id: 'record-1',
          sessionId: 'session-1',
          questionOrder: 2,
          questionText: 'Question 2',
          fullAnswer: 'Answer 2',
          targetSeconds: 90,
          elapsedSeconds: 120,
          createdAt: new Date('2026-05-24T21:00:00.000Z'),
          updatedAt: new Date('2026-05-24T21:00:00.000Z'),
        },
      ],
    } as IResult<unknown>);

    await expect(repository.listAnswers()).resolves.toEqual([
      {
        id: 'record-1',
        sessionId: 'session-1',
        questionOrder: 2,
        questionText: 'Question 2',
        fullAnswer: 'Answer 2',
        targetSeconds: 90,
        elapsedSeconds: 120,
        createdAt: '2026-05-24T21:00:00.000Z',
        updatedAt: '2026-05-24T21:00:00.000Z',
      },
    ]);
  });

  it('lists answers for a specific session', async () => {
    query.mockResolvedValueOnce({
      recordset: [
        {
          id: 'record-2',
          sessionId: 'session-2',
          questionOrder: 1,
          questionText: 'Question 1\nWith more context',
          fullAnswer: 'Answer 1',
          targetSeconds: 60,
          elapsedSeconds: 75,
          createdAt: new Date('2026-05-24T22:00:00.000Z'),
          updatedAt: new Date('2026-05-24T22:00:00.000Z'),
        },
      ],
    } as IResult<unknown>);

    await expect(repository.listAnswersBySession('session-2')).resolves.toEqual(
      [
        {
          id: 'record-2',
          sessionId: 'session-2',
          questionOrder: 1,
          questionText: 'Question 1\nWith more context',
          fullAnswer: 'Answer 1',
          targetSeconds: 60,
          elapsedSeconds: 75,
          createdAt: '2026-05-24T22:00:00.000Z',
          updatedAt: '2026-05-24T22:00:00.000Z',
        },
      ],
    );
  });
});
