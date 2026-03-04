import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('plans')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.findOne(id);
  }

  @Post(':id/activate')
  activate(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) planId: string,
  ) {
    return this.plansService.activate(userId, planId);
  }
}
