export const PRACTICE_SESSIONS_SCHEMA_SQL = `
IF OBJECT_ID('dbo.practice_sessions', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.practice_sessions (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    raw_question_block NVARCHAR(MAX) NOT NULL,
    parsed_questions NVARCHAR(MAX) NOT NULL,
    target_seconds INT NOT NULL,
    status NVARCHAR(32) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );

  CREATE INDEX IX_practice_sessions_created_at
    ON dbo.practice_sessions (created_at DESC);

  CREATE INDEX IX_practice_sessions_status_created_at
    ON dbo.practice_sessions (status, created_at DESC);
END;
`;
