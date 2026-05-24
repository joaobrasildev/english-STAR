import { loadAppConfig, loadSqlServerConfig } from './env';

describe('env config', () => {
  it('loads app config defaults when optional env vars are absent', () => {
    expect(loadAppConfig({})).toEqual({
      port: 3100,
      frontendOrigin: 'http://localhost:5173',
    });
  });

  it('rejects non-numeric port values', () => {
    expect(() => loadAppConfig({ PORT: 'abc' })).toThrow(
      'PORT must be a positive integer.',
    );
  });

  it('loads SQL Server config from required env vars', () => {
    expect(
      loadSqlServerConfig({
        SQLSERVER_HOST: 'localhost',
        SQLSERVER_PORT: '1433',
        SQLSERVER_USER: 'sa',
        SQLSERVER_PASSWORD: 'Secret123!',
        SQLSERVER_DATABASE: 'master',
      }),
    ).toEqual({
      host: 'localhost',
      port: 1433,
      user: 'sa',
      password: 'Secret123!',
      database: 'master',
    });
  });

  it('returns a descriptive error when a required SQL env var is missing', () => {
    expect(() =>
      loadSqlServerConfig({
        SQLSERVER_HOST: 'localhost',
        SQLSERVER_USER: 'sa',
        SQLSERVER_DATABASE: 'master',
      }),
    ).toThrow('SQLSERVER_PASSWORD is required.');
  });
});
