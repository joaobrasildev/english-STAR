/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { ConnectionPool } from 'mssql';
import { loadSqlServerConfig } from '../src/config/env';
import { AppModule } from '../src/app.module';
import { ANSWERS_DB_POOL } from '../src/answers/answers.repository';
import { ANSWER_RECORDS_SCHEMA_SQL } from '../src/answers/answer-records.schema';

describe('Answers endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let pool: ConnectionPool;

  beforeAll(async () => {
    process.env.SQLSERVER_HOST ??= 'localhost';
    process.env.SQLSERVER_PORT ??= '14330';
    process.env.SQLSERVER_USER ??= 'sa';
    process.env.SQLSERVER_PASSWORD ??= 'YourStrong!Passw0rd';
    process.env.SQLSERVER_DATABASE ??= 'master';

    pool = await new ConnectionPool({
      server: loadSqlServerConfig().host,
      port: loadSqlServerConfig().port,
      user: loadSqlServerConfig().user,
      password: loadSqlServerConfig().password,
      database: loadSqlServerConfig().database,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }).connect();

    await pool.request().batch(ANSWER_RECORDS_SCHEMA_SQL);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(async () => {
    await pool
      .request()
      .query("DELETE FROM dbo.answer_records WHERE session_id LIKE 'e2e-%';");
  });

  afterAll(async () => {
    const appPool = app.get<ConnectionPool>(ANSWERS_DB_POOL);
    await appPool.close();
    await app.close();
    await pool.close();
  });

  it('POST /answers persists a valid answer and GET endpoints read it back', async () => {
    const payload = {
      sessionId: 'e2e-session-1',
      questionOrder: 1,
      questionText:
        'Tell me about a challenge you solved.\nFocus on the turning point.',
      fullAnswer: 'Situation\nTask\nAction\nResult',
      targetSeconds: 120,
      elapsedSeconds: 145,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/answers')
      .send(payload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      sessionId: 'e2e-session-1',
      questionOrder: 1,
      targetSeconds: 120,
      elapsedSeconds: 145,
    });

    const sessionsResponse = await request(app.getHttpServer())
      .get('/sessions')
      .expect(200);
    expect(sessionsResponse.body).toEqual([
      expect.objectContaining({
        sessionId: 'e2e-session-1',
        answeredCount: 1,
        totalElapsedSeconds: 145,
      }),
    ]);

    const answersResponse = await request(app.getHttpServer())
      .get('/sessions/e2e-session-1/answers')
      .expect(200);

    expect(answersResponse.body).toEqual([
      expect.objectContaining({
        sessionId: 'e2e-session-1',
        questionOrder: 1,
        questionText: payload.questionText,
      }),
    ]);
  });

  it('POST /answers rejects invalid payloads', async () => {
    await request(app.getHttpServer())
      .post('/answers')
      .send({
        questionOrder: 1,
        questionText: 'Question',
        fullAnswer: 'Answer',
        targetSeconds: 90,
        elapsedSeconds: -1,
      })
      .expect(400);
  });
});
