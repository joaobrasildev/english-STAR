export type AppConfig = {
  port: number;
  frontendOrigin: string;
};

export type SqlServerConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

type EnvSource = Record<string, string | undefined>;

const DEFAULT_PORT = 3100;
const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:5173';

function parseInteger(
  value: string | undefined,
  fallback: number,
  key: string,
): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive integer.`);
  }

  return parsed;
}

function requireValue(env: EnvSource, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

export function loadAppConfig(env: EnvSource = process.env): AppConfig {
  return {
    port: parseInteger(env.PORT, DEFAULT_PORT, 'PORT'),
    frontendOrigin: env.FRONTEND_ORIGIN?.trim() || DEFAULT_FRONTEND_ORIGIN,
  };
}

export function loadSqlServerConfig(
  env: EnvSource = process.env,
): SqlServerConfig {
  return {
    host: requireValue(env, 'SQLSERVER_HOST'),
    port: parseInteger(env.SQLSERVER_PORT, 14330, 'SQLSERVER_PORT'),
    user: requireValue(env, 'SQLSERVER_USER'),
    password: requireValue(env, 'SQLSERVER_PASSWORD'),
    database: requireValue(env, 'SQLSERVER_DATABASE'),
  };
}
