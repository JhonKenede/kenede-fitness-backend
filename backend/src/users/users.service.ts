import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: user,
      message: 'User profile retrieved',
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: { ...dto },
      create: {
        userId,
        firstName: dto.firstName || '',
        lastName: dto.lastName,
        age: dto.age,
        weight: dto.weight,
        height: dto.height,
        goal: dto.goal,
        level: dto.level || 'BEGINNER',
        injuries: dto.injuries || [],
        daysPerWeek: dto.daysPerWeek,
        equipment: dto.equipment || [],
      },
    });

    return {
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    };
  }
}
