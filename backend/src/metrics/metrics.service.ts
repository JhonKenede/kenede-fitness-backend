import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const metrics = await this.prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return {
      success: true,
      data: metrics,
      message: 'Metrics retrieved',
    };
  }

  async create(userId: string, dto: CreateMetricDto) {
    const metric = await this.prisma.bodyMetric.create({
      data: {
        userId,
        date: dto.date ? new Date(dto.date) : new Date(),
        weight: dto.weight,
        bodyFat: dto.bodyFat,
        muscleMass: dto.muscleMass,
        bmi: dto.bmi,
        notes: dto.notes,
      },
    });

    return {
      success: true,
      data: metric,
      message: 'Metric recorded successfully',
    };
  }
}
