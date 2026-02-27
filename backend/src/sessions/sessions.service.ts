import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const sessions = await this.prisma.trainingSession.findMany({
      where: { userId },
      include: {
        workout: { select: { id: true, name: true } },
        logs: {
          include: { exercise: { select: { id: true, name: true, muscleGroup: true } } },
        },
      },
      orderBy: { date: 'desc' },
    });

    return {
      success: true,
      data: sessions,
      message: 'Sessions retrieved',
    };
  }

  async findOne(userId: string, sessionId: string) {
    const session = await this.prisma.trainingSession.findUnique({
      where: { id: sessionId },
      include: {
        workout: true,
        logs: {
          include: { exercise: true },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      success: true,
      data: session,
      message: 'Session retrieved',
    };
  }

  async create(userId: string, dto: CreateSessionDto) {
    // Auto-calculate totalVolume from logs if not explicitly provided
    let totalVolume = dto.totalVolume;
    if (totalVolume === undefined && dto.logs && dto.logs.length > 0) {
      totalVolume = dto.logs.reduce((sum, log) => {
        return sum + log.sets * log.reps * (log.weight ?? 0);
      }, 0);
      totalVolume = Math.round(totalVolume * 100) / 100;
    }

    const session = await this.prisma.trainingSession.create({
      data: {
        userId,
        workoutId: dto.workoutId,
        date: dto.date ? new Date(dto.date) : new Date(),
        duration: dto.duration,
        totalVolume,
        rpe: dto.rpe,
        notes: dto.notes,
        completed: dto.completed ?? true,
        logs: dto.logs
          ? {
              create: dto.logs.map((log) => ({
                exerciseId: log.exerciseId,
                sets: log.sets,
                reps: log.reps,
                weight: log.weight,
                rpe: log.rpe,
                notes: log.notes,
              })),
            }
          : undefined,
      },
      include: {
        workout: { select: { id: true, name: true } },
        logs: {
          include: { exercise: { select: { id: true, name: true, muscleGroup: true } } },
        },
      },
    });

    return {
      success: true,
      data: session,
      message: 'Session recorded successfully',
    };
  }

  async getStats(userId: string) {
    const sessions = await this.prisma.trainingSession.findMany({
      where: { userId, completed: true },
      include: {
        logs: {
          include: { exercise: { select: { muscleGroup: true } } },
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalSessions = sessions.length;
    const totalVolume = sessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const sessionsWithRpe = sessions.filter((s) => s.rpe);
    const avgRpe =
      sessionsWithRpe.length > 0
        ? sessionsWithRpe.reduce((sum, s) => sum + (s.rpe || 0), 0) / sessionsWithRpe.length
        : null;

    // Sessions this week (Monday–Sunday)
    const weekStart = getWeekStart(new Date());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const sessionsThisWeek = sessions.filter(
      (s) => s.date >= weekStart && s.date < weekEnd,
    ).length;

    // Most worked muscle group
    const muscleCount: Record<string, number> = {};
    for (const session of sessions) {
      for (const log of session.logs) {
        const mg = log.exercise.muscleGroup as string;
        muscleCount[mg] = (muscleCount[mg] || 0) + 1;
      }
    }
    const mostWorkedMuscle =
      Object.keys(muscleCount).length > 0
        ? Object.entries(muscleCount).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    // Sessions per week (last 4 weeks) — kept for backwards compatibility
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentSessions = sessions.filter((s) => s.date >= fourWeeksAgo);
    const sessionsPerWeek = recentSessions.length / 4;

    // Volume by week (last 8 weeks)
    const weeklyVolume: Record<string, number> = {};
    sessions.forEach((session) => {
      const ws = getWeekStart(session.date);
      const key = ws.toISOString().split('T')[0];
      weeklyVolume[key] = (weeklyVolume[key] || 0) + (session.totalVolume || 0);
    });

    return {
      success: true,
      data: {
        totalSessions,
        sessionsThisWeek,
        totalVolume: Math.round(totalVolume * 100) / 100,
        totalDuration,
        avgRpe: avgRpe ? Math.round(avgRpe * 10) / 10 : null,
        sessionsPerWeek: Math.round(sessionsPerWeek * 10) / 10,
        mostWorkedMuscle,
        weeklyVolume,
      },
      message: 'Stats retrieved',
    };
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
