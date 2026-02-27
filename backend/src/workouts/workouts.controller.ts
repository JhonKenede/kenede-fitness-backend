import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class WorkoutsController {
  constructor(private workoutsService: WorkoutsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.workoutsService.findAll(userId);
  }

  @Get('schedule')
  getSchedule(@CurrentUser('id') userId: string) {
    return this.workoutsService.getSchedule(userId);
  }

  @Get('today')
  getTodayWorkout(@CurrentUser('id') userId: string) {
    return this.workoutsService.getTodayWorkout(userId);
  }

  @Get('templates')
  getTemplates() {
    return this.workoutsService.getTemplates();
  }

  @Post('templates/:category/start')
  startTemplate(
    @CurrentUser('id') userId: string,
    @Param('category') category: string,
  ) {
    return this.workoutsService.startTemplate(userId, category);
  }

  @Get(':id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) workoutId: string,
  ) {
    return this.workoutsService.findOne(userId, workoutId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(userId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) workoutId: string,
    @Body() dto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(userId, workoutId, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) workoutId: string,
  ) {
    return this.workoutsService.remove(userId, workoutId);
  }
}
