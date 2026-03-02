import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MuscleGroup, Level, ExerciseType } from '@prisma/client';

export interface ExerciseFilters {
  muscleGroup?: MuscleGroup;
  level?: Level;
  type?: ExerciseType;
  search?: string;
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
    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    const exercises = await this.prisma.exercise.findMany({
      where,
      orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
    });

    return exercises;
  }

  async findOne(exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }
}
