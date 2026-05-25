/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { ConnectionPool, Int, MAX, NVarChar } from 'mssql';
import { SQLSERVER_DB_POOL } from '../database/sqlserver.module';
import { PRACTICE_SESSIONS_SCHEMA_SQL } from './session-records.schema';
import type { CreateSessionDto } from './dto/create-session.dto';
import type { PracticeSessionRecord } from './sessions.types';

type PracticeSessionRow = {
  sessionId: string;
  rawQuestionBlock: string;
  parsedQuestions: string;
  targetSeconds: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class SessionsRepository {
  private schemaReady = false;

  constructor(
    @Inject(SQLSERVER_DB_POOL)
    private readonly pool: ConnectionPool,
  ) {}

  async createSession(input: CreateSessionDto): Promise<PracticeSessionRecord> {
    await this.ensureSchema();

    const result = await this.pool
      .request()
      .input('rawQuestionBlock', NVarChar(MAX), input.rawQuestionBlock)
      .input(
        'parsedQuestions',
        NVarChar(MAX),
        JSON.stringify(input.parsedQuestions),
      )
      .input('targetSeconds', Int, input.targetSeconds)
      .query<PracticeSessionRow>(`
        INSERT INTO dbo.practice_sessions (
          raw_question_block,
          parsed_questions,
          target_seconds
        )
        OUTPUT
          inserted.id AS sessionId,
          inserted.raw_question_block AS rawQuestionBlock,
          inserted.parsed_questions AS parsedQuestions,
          inserted.target_seconds AS targetSeconds,
          inserted.status AS status,
          inserted.created_at AS createdAt,
          inserted.updated_at AS updatedAt
        VALUES (
          @rawQuestionBlock,
          @parsedQuestions,
          @targetSeconds
        );
      `);

    return this.mapRecord(result.recordset[0]);
  }

  async findSessionById(
    sessionId: string,
  ): Promise<PracticeSessionRecord | null> {
    await this.ensureSchema();

    const result = await this.pool
      .request()
      .input('sessionId', NVarChar(64), sessionId).query<PracticeSessionRow>(`
        SELECT
          CONVERT(NVARCHAR(36), id) AS sessionId,
          raw_question_block AS rawQuestionBlock,
          parsed_questions AS parsedQuestions,
          target_seconds AS targetSeconds,
          status AS status,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM dbo.practice_sessions
        WHERE CONVERT(NVARCHAR(36), id) = @sessionId;
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    return this.mapRecord(result.recordset[0]);
  }

  private async ensureSchema(): Promise<void> {
    if (this.schemaReady) {
      return;
    }

    await this.pool.request().batch(PRACTICE_SESSIONS_SCHEMA_SQL);
    this.schemaReady = true;
  }

  private mapRecord(
    row: PracticeSessionRow | undefined,
  ): PracticeSessionRecord {
    if (!row) {
      throw new Error(
        'Practice session record was not returned by the database.',
      );
    }

    return {
      sessionId: row.sessionId,
      rawQuestionBlock: row.rawQuestionBlock,
      parsedQuestions: JSON.parse(row.parsedQuestions) as string[],
      targetSeconds: row.targetSeconds,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
