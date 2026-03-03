import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { AddGroupWorkoutDto, UpdateProgressDto } from './dto/group-workout.dto';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  // ── Crear grupo ────────────────────────────────────────────────────────────
  async createGroup(userId: string, dto: CreateGroupDto) {
    let inviteCode: string;
    let attempts = 0;
    do {
      inviteCode = generateInviteCode();
      attempts++;
      if (attempts > 10) throw new BadRequestException('Could not generate unique invite code');
    } while (await this.prisma.trainingGroup.findUnique({ where: { inviteCode } }));

    const group = await this.prisma.trainingGroup.create({
      data: {
        name: dto.name,
        description: dto.description,
        inviteCode,
        adminId: userId,
        members: {
          create: { userId, role: 'ADMIN' },
        },
      },
      include: this.groupInclude(userId),
    });

    return { success: true, data: group, message: 'Group created' };
  }

  // ── Mis grupos ────────────────────────────────────────────────────────────
  async getMyGroups(userId: string) {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: { select: { members: true, workouts: true } },
            admin: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          },
        },
      },
    });

    const data = memberships.map(m => ({
      ...m.group,
      myRole: m.role,
    }));

    return { success: true, data, message: 'Groups retrieved' };
  }

  // ── Detalle del grupo ─────────────────────────────────────────────────────
  async getGroup(userId: string, groupId: string) {
    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this group');

    const group = await this.prisma.trainingGroup.findUnique({
      where: { id: groupId },
      include: this.groupInclude(userId),
    });
    if (!group) throw new NotFoundException('Group not found');

    return { success: true, data: { ...group, myRole: member.role }, message: 'Group retrieved' };
  }

  // ── Unirse con código ─────────────────────────────────────────────────────
  async joinGroup(userId: string, dto: JoinGroupDto) {
    const group = await this.prisma.trainingGroup.findUnique({
      where: { inviteCode: dto.inviteCode.toUpperCase(), isActive: true },
    });
    if (!group) throw new NotFoundException('Invalid or expired invite code');

    const existing = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId } },
    });
    if (existing) throw new ConflictException('Already a member of this group');

    await this.prisma.groupMember.create({
      data: { groupId: group.id, userId, role: 'MEMBER' },
    });

    return { success: true, data: { groupId: group.id, name: group.name }, message: `Joined group "${group.name}"` };
  }

  // ── Salir del grupo ───────────────────────────────────────────────────────
  async leaveGroup(userId: string, groupId: string) {
    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!member) throw new NotFoundException('Not a member');
    if (member.role === 'ADMIN') throw new ForbiddenException('Admin cannot leave. Delete the group instead.');

    await this.prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });

    return { success: true, data: null, message: 'Left the group' };
  }

  // ── Eliminar grupo (solo admin) ───────────────────────────────────────────
  async deleteGroup(userId: string, groupId: string) {
    await this.assertAdmin(userId, groupId);
    await this.prisma.trainingGroup.update({
      where: { id: groupId },
      data: { isActive: false },
    });
    return { success: true, data: null, message: 'Group deleted' };
  }

  // ── Rutinas del grupo ─────────────────────────────────────────────────────
  async getGroupWorkouts(userId: string, groupId: string) {
    await this.assertMember(userId, groupId);

    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    const workouts = await this.prisma.groupWorkout.findMany({
      where: { groupId },
      include: {
        workout: {
          include: {
            exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
          },
        },
        progress: {
          where: { groupMemberId: member!.id },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    const data = workouts.map(gw => ({
      ...gw,
      myProgress: gw.progress[0] ?? null,
      progress: undefined,
    }));

    return { success: true, data, message: 'Group workouts retrieved' };
  }

  // ── Añadir rutina al grupo (solo admin) ──────────────────────────────────
  async addWorkoutToGroup(userId: string, groupId: string, dto: AddGroupWorkoutDto) {
    await this.assertAdmin(userId, groupId);

    // Verificar que el workout existe y pertenece al admin
    const workout = await this.prisma.workout.findFirst({
      where: { id: dto.workoutId, userId, isActive: true },
    });
    if (!workout) throw new NotFoundException('Workout not found or not yours');

    // Evitar duplicados
    const existing = await this.prisma.groupWorkout.findFirst({
      where: { groupId, workoutId: dto.workoutId },
    });
    if (existing) throw new ConflictException('Workout already in the group');

    const groupWorkout = await this.prisma.groupWorkout.create({
      data: { groupId, workoutId: dto.workoutId, addedById: userId },
      include: {
        workout: {
          include: { exercises: { include: { exercise: true }, orderBy: { order: 'asc' } } },
        },
      },
    });

    return { success: true, data: groupWorkout, message: 'Workout added to group' };
  }

  // ── Eliminar rutina del grupo (solo admin) ────────────────────────────────
  async removeWorkoutFromGroup(userId: string, groupId: string, groupWorkoutId: string) {
    await this.assertAdmin(userId, groupId);

    const gw = await this.prisma.groupWorkout.findFirst({
      where: { id: groupWorkoutId, groupId },
    });
    if (!gw) throw new NotFoundException('Group workout not found');

    await this.prisma.groupWorkout.delete({ where: { id: groupWorkoutId } });

    return { success: true, data: null, message: 'Workout removed from group' };
  }

  // ── Marcar/actualizar progreso ────────────────────────────────────────────
  async updateProgress(userId: string, groupId: string, groupWorkoutId: string, dto: UpdateProgressDto) {
    await this.assertMember(userId, groupId);

    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    const gw = await this.prisma.groupWorkout.findFirst({
      where: { id: groupWorkoutId, groupId },
    });
    if (!gw) throw new NotFoundException('Group workout not found');

    const progress = await this.prisma.workoutProgress.upsert({
      where: {
        groupMemberId_groupWorkoutId: {
          groupMemberId: member!.id,
          groupWorkoutId,
        },
      },
      create: {
        groupMemberId: member!.id,
        groupWorkoutId,
        completed: dto.completed,
        completedAt: dto.completed ? new Date() : null,
        notes: dto.notes,
      },
      update: {
        completed: dto.completed,
        completedAt: dto.completed ? new Date() : null,
        notes: dto.notes,
      },
    });

    return { success: true, data: progress, message: 'Progress updated' };
  }

  // ── Progreso de todos los miembros ─────────────────────────────────────────
  async getGroupProgress(userId: string, groupId: string) {
    await this.assertMember(userId, groupId);

    const members = await this.prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        progress: {
          include: {
            groupWorkout: {
              include: { workout: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });

    const data = members.map(m => ({
      userId: m.userId,
      name: m.user.profile
        ? `${m.user.profile.firstName} ${m.user.profile.lastName ?? ''}`.trim()
        : m.user.email,
      role: m.role,
      progress: m.progress.map(p => ({
        workoutId: p.groupWorkout.workoutId,
        workoutName: p.groupWorkout.workout.name,
        completed: p.completed,
        completedAt: p.completedAt,
        notes: p.notes,
      })),
      completedCount: m.progress.filter(p => p.completed).length,
      totalWorkouts: m.progress.length,
    }));

    return { success: true, data, message: 'Group progress retrieved' };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private async assertMember(userId: string, groupId: string) {
    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this group');
    return member;
  }

  private async assertAdmin(userId: string, groupId: string) {
    const member = await this.assertMember(userId, groupId);
    if (member.role !== 'ADMIN') throw new ForbiddenException('Only admins can perform this action');
    return member;
  }

  private groupInclude(userId: string) {
    return {
      admin: {
        select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } },
      },
      members: {
        include: {
          user: {
            select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } },
          },
        },
      },
      workouts: {
        include: {
          workout: {
            include: { exercises: { include: { exercise: true }, orderBy: { order: 'asc' } } },
          },
        },
      },
      _count: { select: { members: true, workouts: true } },
    };
  }
}
