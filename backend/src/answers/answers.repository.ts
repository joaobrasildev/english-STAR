/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { ConnectionPool, Int, MAX, NVarChar } from 'mssql';
import { SQLSERVER_DB_POOL } from '../database/sqlserver.module';
import { ANSWER_RECORDS_SCHEMA_SQL } from './answer-records.schema';
import type { CreateAnswerDto } from './dto/create-answer.dto';
import type { AnswerRecord } from './answers.types';

type AnswerRow = {
  id: string;
  sessionId: string;
  questionOrder: number;
  questionText: string;
  fullAnswer: string;
  targetSeconds: number;
  elapsedSeconds: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AnswersRepository {
  private schemaReady = false;

  constructor(
    @Inject(SQLSERVER_DB_POOL)
    private readonly pool: ConnectionPool,
  ) {}

  async createAnswer(input: CreateAnswerDto): Promise<AnswerRecord> {
    await this.ensureSchema();

    const result = await this.pool
      .request()
      .input('sessionId', NVarChar(64), input.sessionId)
      .input('questionOrder', Int, input.questionOrder)
      .input('questionText', NVarChar(MAX), input.questionText)
      .input('fullAnswer', NVarChar(MAX), input.fullAnswer)
      .input('targetSeconds', Int, input.targetSeconds)
      .input('elapsedSeconds', Int, input.elapsedSeconds).query<AnswerRow>(`
        INSERT INTO dbo.answer_records (
          session_id,
          question_order,
          question_text,
          full_answer,
          target_seconds,
          elapsed_seconds
        )
        OUTPUT
          inserted.id AS id,
          inserted.session_id AS sessionId,
          inserted.question_order AS questionOrder,
          inserted.question_text AS questionText,
          inserted.full_answer AS fullAnswer,
          inserted.target_seconds AS targetSeconds,
          inserted.elapsed_seconds AS elapsedSeconds,
          inserted.created_at AS createdAt,
          inserted.updated_at AS updatedAt
        VALUES (
          @sessionId,
          @questionOrder,
          @questionText,
          @fullAnswer,
          @targetSeconds,
          @elapsedSeconds
        );
      `);

    return this.mapRecord(result.recordset[0]);
  }

  async listAnswers(): Promise<AnswerRecord[]> {
    await this.ensureSchema();

    const result = await this.pool.request().query<AnswerRow>(`
      SELECT
        id,
        session_id AS sessionId,
        question_order AS questionOrder,
        question_text AS questionText,
        full_answer AS fullAnswer,
        target_seconds AS targetSeconds,
        elapsed_seconds AS elapsedSeconds,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM dbo.answer_records
      ORDER BY created_at DESC, question_order ASC;
    `);

    return result.recordset.map((row) => this.mapRecord(row));
  }

  async listAnswersBySession(sessionId: string): Promise<AnswerRecord[]> {
    await this.ensureSchema();

    const result = await this.pool
      .request()
      .input('sessionId', NVarChar(64), sessionId).query<AnswerRow>(`
        SELECT
          id,
          session_id AS sessionId,
          question_order AS questionOrder,
          question_text AS questionText,
          full_answer AS fullAnswer,
          target_seconds AS targetSeconds,
          elapsed_seconds AS elapsedSeconds,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM dbo.answer_records
        WHERE session_id = @sessionId
        ORDER BY question_order ASC, created_at ASC;
      `);

    return result.recordset.map((row) => this.mapRecord(row));
  }

  private async ensureSchema(): Promise<void> {
    if (this.schemaReady) {
      return;
    }

    await this.pool.request().batch(ANSWER_RECORDS_SCHEMA_SQL);
    this.schemaReady = true;
  }

  private mapRecord(row: AnswerRow | undefined): AnswerRecord {
    if (!row) {
      throw new Error('Answer record was not returned by the database.');
    }

    return {
      id: row.id,
      sessionId: row.sessionId,
      questionOrder: row.questionOrder,
      questionText: row.questionText,
      fullAnswer: row.fullAnswer,
      targetSeconds: row.targetSeconds,
      elapsedSeconds: row.elapsedSeconds,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
