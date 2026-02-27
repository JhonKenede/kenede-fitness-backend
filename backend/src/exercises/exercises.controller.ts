import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { MuscleGroup, Level, ExerciseType } from '@prisma/client';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get()
  findAll(
    @Query('muscleGroup') muscleGroup?: MuscleGroup,
    @Query('level') level?: Level,
    @Query('type') type?: ExerciseType,
  ) {
    return this.exercisesService.findAll({ muscleGroup, level, type });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) exerciseId: string) {
    return this.exercisesService.findOne(exerciseId);
  }
}
