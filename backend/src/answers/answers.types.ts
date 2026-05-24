export type AnswerRecord = {
  id: string;
  sessionId: string;
  questionOrder: number;
  questionText: string;
  fullAnswer: string;
  targetSeconds: number;
  elapsedSeconds: number;
  createdAt: string;
  updatedAt: string;
};

export type SessionSummary = {
  sessionId: string;
  answeredCount: number;
  targetSeconds: number;
  totalElapsedSeconds: number;
  completedAt: string;
};
