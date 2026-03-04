import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MAP: Record<number, string> = {
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
  7: 'SUNDAY',
};

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.trainingPlan.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        goal: true,
        gender: true,
        daysPerWeek: true,
        level: true,
        emoji: true,
        days: {
          select: {
            dayNumber: true,
            dayLabel: true,
            isRestDay: true,
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.trainingPlan.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            workout: {
              include: {
                exercises: {
                  include: { exercise: true },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!plan) throw new NotFoundException(`Plan with id ${id} not found`);
    return plan;
  }

  async activate(userId: string, planId: string) {
    const plan = await this.prisma.trainingPlan.findUnique({
      where: { id: planId },
      include: {
        days: {
          include: {
            workout: {
              include: {
                exercises: { orderBy: { order: 'asc' } },
              },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!plan) throw new NotFoundException(`Plan with id ${planId} not found`);

    const daysAssigned: string[] = [];
    let dayOfWeekIndex = 1; // starts at MONDAY

    for (const planDay of plan.days) {
      if (planDay.isRestDay || !planDay.workout) {
        // Skip rest days — advance index only if day is supposed to consume a slot
        if (!planDay.isRestDay) dayOfWeekIndex++;
        continue;
      }

      const dayOfWeek = DAY_MAP[dayOfWeekIndex];
      if (!dayOfWeek) {
        dayOfWeekIndex++;
        continue;
      }

      // Create a copy of the template workout for this user
      const newWorkout = await this.prisma.workout.create({
        data: {
          userId,
          name: planDay.workout.name,
          description: planDay.workout.description,
          category: planDay.workout.category,
          muscleGroups: planDay.workout.muscleGroups,
          isTemplate: false,
          isActive: true,
          dayOfWeek: [dayOfWeek as any],
        },
      });

      // Copy all exercises from the template
      if (planDay.workout.exercises.length > 0) {
        await this.prisma.workoutExercise.createMany({
          data: planDay.workout.exercises.map((ex) => ({
            workoutId: newWorkout.id,
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restTime: ex.restTime,
            order: ex.order,
          })),
        });
      }

      daysAssigned.push(dayOfWeek);
      dayOfWeekIndex++;
    }

    return {
      success: true,
      planName: plan.name,
      workoutsCreated: daysAssigned.length,
      daysAssigned,
    };
  }
}
