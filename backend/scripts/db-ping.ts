import 'dotenv/config';
import sql from 'mssql';
import { loadSqlServerConfig } from '../src/config/env';

async function pingDatabase(): Promise<void> {
  const config = loadSqlServerConfig();
  const connection = await sql.connect({
    server: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  });

  try {
    await connection.request().query('SELECT 1');
    console.log('SQL Server connection succeeded.');
  } finally {
    await connection.close();
  }
}

pingDatabase().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`SQL Server connection failed: ${message}`);
  process.exitCode = 1;
});
