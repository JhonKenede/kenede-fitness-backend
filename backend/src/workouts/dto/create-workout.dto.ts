import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsInt,
  Min,
  IsNumber,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from '@prisma/client';

export class WorkoutExerciseDto {
  @IsUUID()
  exerciseId: string;

  @IsInt()
  @Min(1)
  sets: number;

  @IsInt()
  @Min(1)
  reps: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  restTime?: number;

  @IsInt()
  @Min(0)
  order: number;
}

export class CreateWorkoutDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];

  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  dayOfWeek?: DayOfWeek[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  muscleGroups?: string[];
}
