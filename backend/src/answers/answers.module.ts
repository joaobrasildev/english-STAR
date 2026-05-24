/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConnectionPool } from 'mssql';
import { loadSqlServerConfig } from '../config/env';
import { AnswersController } from './answers.controller';
import { ANSWERS_DB_POOL, AnswersRepository } from './answers.repository';
import { AnswersService } from './answers.service';

@Module({
  controllers: [AnswersController],
  providers: [
    AnswersService,
    AnswersRepository,
    {
      provide: ANSWERS_DB_POOL,
      useFactory: () => {
        const config = loadSqlServerConfig();

        return new ConnectionPool({
          server: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
          options: {
            encrypt: false,
            trustServerCertificate: true,
          },
        }).connect();
      },
    },
  ],
  exports: [AnswersService],
})
export class AnswersModule {}
