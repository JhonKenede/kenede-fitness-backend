import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DayOfWeek } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

const DAY_INDEX_TO_ENUM: DayOfWeek[] = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
];

const VALID_CATEGORIES = ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY'];

const WORKOUT_INCLUDE = {
  exercises: {
    include: { exercise: true },
    orderBy: { order: 'asc' as const },
  },
  _count: { select: { sessions: true } },
};

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const workouts = await this.prisma.workout.findMany({
      where: { userId, isActive: true, isTemplate: false },
      include: WORKOUT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: workouts,
      message: 'Workouts retrieved',
    };
  }

  async findOne(userId: string, workoutId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
      include: WORKOUT_INCLUDE,
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (!workout.isTemplate && workout.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      success: true,
      data: workout,
      message: 'Workout retrieved',
    };
  }

  async create(userId: string, dto: CreateWorkoutDto) {
    // Validate exercise IDs against the DB — filter out any that don't exist
    // (handles fake IDs like "fb-c1" gracefully instead of crashing)
    let validExercises: typeof dto.exercises = [];
    if (dto.exercises && dto.exercises.length > 0) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validIds = dto.exercises
        .map((ex) => ex.exerciseId)
        .filter((id) => uuidRegex.test(id));

      if (validIds.length > 0) {
        const existingExercises = await this.prisma.exercise.findMany({
          where: { id: { in: validIds } },
          select: { id: true },
        });
        const existingSet = new Set(existingExercises.map((e) => e.id));
        validExercises = dto.exercises.filter((ex) => existingSet.has(ex.exerciseId));
      }
    }

    const workout = await this.prisma.workout.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        dayOfWeek: dto.dayOfWeek ?? [],
        muscleGroups: dto.muscleGroups ?? [],
        exercises: validExercises.length > 0
          ? {
              create: validExercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                restTime: ex.restTime,
                order: ex.order,
              })),
            }
          : undefined,
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      success: true,
      data: workout,
      message: 'Workout created successfully',
    };
  }

  async update(userId: string, workoutId: string, dto: UpdateWorkoutDto) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Validate exercise IDs if exercises are being updated
    let validExercises: typeof dto.exercises = [];
    if (dto.exercises !== undefined) {
      await this.prisma.workoutExercise.deleteMany({ where: { workoutId } });

      if (dto.exercises.length > 0) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const validIds = dto.exercises.map((ex) => ex.exerciseId).filter((id) => uuidRegex.test(id));
        if (validIds.length > 0) {
          const existing = await this.prisma.exercise.findMany({
            where: { id: { in: validIds } },
            select: { id: true },
          });
          const existingSet = new Set(existing.map((e) => e.id));
          validExercises = dto.exercises.filter((ex) => existingSet.has(ex.exerciseId));
        }
      }
    }

    const updated = await this.prisma.workout.update({
      where: { id: workoutId },
      data: {
        name: dto.name,
        description: dto.description,
        dayOfWeek: dto.dayOfWeek,
        muscleGroups: dto.muscleGroups,
        exercises: dto.exercises !== undefined && validExercises.length > 0
          ? {
              create: validExercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                restTime: ex.restTime,
                order: ex.order,
              })),
            }
          : undefined,
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      success: true,
      data: updated,
      message: 'Workout updated successfully',
    };
  }

  async remove(userId: string, workoutId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.workout.update({
      where: { id: workoutId },
      data: { isActive: false },
    });

    return {
      success: true,
      data: null,
      message: 'Workout deleted successfully',
    };
  }

  async getSchedule(userId: string) {
    const workouts = await this.prisma.workout.findMany({
      where: { userId, isActive: true, isTemplate: false },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    const schedule: Record<DayOfWeek, typeof workouts[number] | null> = {
      MONDAY: null,
      TUESDAY: null,
      WEDNESDAY: null,
      THURSDAY: null,
      FRIDAY: null,
      SATURDAY: null,
      SUNDAY: null,
    };

    for (const workout of workouts) {
      for (const day of workout.dayOfWeek) {
        schedule[day] = workout;
      }
    }

    return {
      success: true,
      data: schedule,
      message: 'Schedule retrieved',
    };
  }

  async getTodayWorkout(userId: string) {
    const todayEnum = DAY_INDEX_TO_ENUM[new Date().getDay()];

    const workout = await this.prisma.workout.findFirst({
      where: {
        userId,
        isActive: true,
        isTemplate: false,
        dayOfWeek: { has: todayEnum },
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      success: true,
      data: workout,
      message: workout ? "Today's workout retrieved" : 'No workout scheduled for today',
    };
  }

  async getTemplates() {
    const templates = await this.prisma.workout.findMany({
      where: { isTemplate: true, isActive: true },
      include: WORKOUT_INCLUDE,
      orderBy: { category: 'asc' },
    });

    const grouped: Record<string, (typeof templates)[number]> = {};
    for (const template of templates) {
      if (template.category) {
        grouped[template.category] = template;
      }
    }

    return {
      success: true,
      data: grouped,
      message: 'Template workouts retrieved',
    };
  }

  async startTemplate(userId: string, category: string) {
    const upperCategory = category.toUpperCase();
    if (!VALID_CATEGORIES.includes(upperCategory)) {
      throw new BadRequestException(
        `Invalid category. Valid options: ${VALID_CATEGORIES.join(', ')}`,
      );
    }

    const template = await this.prisma.workout.findFirst({
      where: { isTemplate: true, category: upperCategory, isActive: true },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`No template found for category: ${upperCategory}`);
    }

    // Copy template to user's workouts
    const newWorkout = await this.prisma.workout.create({
      data: {
        userId,
        name: template.name,
        description: template.description,
        isTemplate: false,
        category: template.category,
        muscleGroups: template.muscleGroups,
        dayOfWeek: [],
        exercises: {
          create: template.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restTime: ex.restTime,
            order: ex.order,
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      success: true,
      data: newWorkout,
      message: `Template "${template.name}" copied to your workouts. Ready to start!`,
    };
  }
}
