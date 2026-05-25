export type PracticeSessionRecord = {
  sessionId: string;
  rawQuestionBlock: string;
  parsedQuestions: string[];
  targetSeconds: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};
