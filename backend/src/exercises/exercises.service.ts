import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MuscleGroup, Level, ExerciseType } from '@prisma/client';

export interface ExerciseFilters {
  muscleGroup?: MuscleGroup;
  level?: Level;
  type?: ExerciseType;
}

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: ExerciseFilters) {
    const where: any = {};

    if (filters.muscleGroup) {
      where.muscleGroup = filters.muscleGroup;
    }
    if (filters.level) {
      where.level = filters.level;
    }
    if (filters.type) {
      where.type = filters.type;
    }

    const exercises = await this.prisma.exercise.findMany({
      where,
      orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
    });

    return {
      success: true,
      data: exercises,
      message: 'Exercises retrieved',
    };
  }

  async findOne(exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return {
      success: true,
      data: exercise,
      message: 'Exercise retrieved',
    };
  }
}
