import {
  Controller, Get, Post, Delete, Param, Body,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { AddGroupWorkoutDto, UpdateProgressDto } from './dto/group-workout.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // Crear grupo
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(userId, dto);
  }

  // Mis grupos
  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.groupsService.getMyGroups(userId);
  }

  // Unirse con código de invitación
  @Post('join')
  @HttpCode(HttpStatus.OK)
  join(@CurrentUser('id') userId: string, @Body() dto: JoinGroupDto) {
    return this.groupsService.joinGroup(userId, dto);
  }

  // Detalle del grupo
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') groupId: string) {
    return this.groupsService.getGroup(userId, groupId);
  }

  // Eliminar grupo (solo admin)
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') groupId: string) {
    return this.groupsService.deleteGroup(userId, groupId);
  }

  // Salir del grupo
  @Delete(':id/leave')
  leave(@CurrentUser('id') userId: string, @Param('id') groupId: string) {
    return this.groupsService.leaveGroup(userId, groupId);
  }

  // Ver rutinas del grupo
  @Get(':id/workouts')
  getWorkouts(@CurrentUser('id') userId: string, @Param('id') groupId: string) {
    return this.groupsService.getGroupWorkouts(userId, groupId);
  }

  // Añadir rutina al grupo (solo admin)
  @Post(':id/workouts')
  addWorkout(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
    @Body() dto: AddGroupWorkoutDto,
  ) {
    return this.groupsService.addWorkoutToGroup(userId, groupId, dto);
  }

  // Eliminar rutina del grupo (solo admin)
  @Delete(':id/workouts/:gwId')
  removeWorkout(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
    @Param('gwId') groupWorkoutId: string,
  ) {
    return this.groupsService.removeWorkoutFromGroup(userId, groupId, groupWorkoutId);
  }

  // Marcar progreso en una rutina
  @Post(':id/workouts/:gwId/progress')
  @HttpCode(HttpStatus.OK)
  updateProgress(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
    @Param('gwId') groupWorkoutId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.groupsService.updateProgress(userId, groupId, groupWorkoutId, dto);
  }

  // Ver progreso de todos los miembros
  @Get(':id/progress')
  getProgress(@CurrentUser('id') userId: string, @Param('id') groupId: string) {
    return this.groupsService.getGroupProgress(userId, groupId);
  }
}
