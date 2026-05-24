import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsInt()
  @Min(1)
  questionOrder!: number;

  @IsString()
  @IsNotEmpty()
  questionText!: string;

  @IsString()
  @IsNotEmpty()
  fullAnswer!: string;

  @IsInt()
  @Min(1)
  targetSeconds!: number;

  @IsInt()
  @Min(0)
  elapsedSeconds!: number;
}
