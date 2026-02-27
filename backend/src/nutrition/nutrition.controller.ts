import { Controller, Get, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class NutritionController {
  constructor(private nutritionService: NutritionService) {}

  @Get('plan')
  getPlan(@CurrentUser('id') userId: string) {
    return this.nutritionService.getPlan(userId);
  }

  @Get('foods')
  getFoods() {
    return this.nutritionService.getFoods();
  }

  @Get('logs')
  getLogs(@CurrentUser('id') userId: string) {
    return this.nutritionService.getLogs(userId);
  }

  @Post('logs')
  createLog(
    @CurrentUser('id') userId: string,
    @Body() dto: { calories: number; protein?: number; carbs?: number; fat?: number; water?: number; notes?: string },
  ) {
    return this.nutritionService.createLog(userId, dto);
  }
}
