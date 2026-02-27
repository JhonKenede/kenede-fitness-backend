import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.sessionsService.findAll(userId);
  }

  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.sessionsService.getStats(userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionsService.findOne(userId, sessionId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.sessionsService.create(userId, dto);
  }
}
