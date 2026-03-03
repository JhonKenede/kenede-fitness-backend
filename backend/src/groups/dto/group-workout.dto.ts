import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class AddGroupWorkoutDto {
  @IsUUID()
  workoutId: string;
}

export class UpdateProgressDto {
  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
