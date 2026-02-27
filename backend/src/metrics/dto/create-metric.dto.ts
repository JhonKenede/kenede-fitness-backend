import {
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateMetricDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(500)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bodyFat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(200)
  muscleMass?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bmi?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
