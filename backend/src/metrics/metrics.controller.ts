import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('metrics')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.metricsService.findAll(userId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMetricDto,
  ) {
    return this.metricsService.create(userId, dto);
  }
}
