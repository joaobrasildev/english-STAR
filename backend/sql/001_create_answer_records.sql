IF OBJECT_ID('dbo.answer_records', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.answer_records (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    session_id NVARCHAR(64) NOT NULL,
    question_order INT NOT NULL,
    question_text NVARCHAR(MAX) NOT NULL,
    full_answer NVARCHAR(MAX) NOT NULL,
    target_seconds INT NOT NULL,
    elapsed_seconds INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );

  CREATE INDEX IX_answer_records_session_order
    ON dbo.answer_records (session_id, question_order);

  CREATE INDEX IX_answer_records_created_at
    ON dbo.answer_records (created_at DESC);
END;
