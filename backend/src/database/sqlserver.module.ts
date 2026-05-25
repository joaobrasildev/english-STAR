/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConnectionPool } from 'mssql';
import { loadSqlServerConfig } from '../config/env';

export const SQLSERVER_DB_POOL = 'SQLSERVER_DB_POOL';

@Module({
  providers: [
    {
      provide: SQLSERVER_DB_POOL,
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
  exports: [SQLSERVER_DB_POOL],
})
export class SqlServerModule {}
