import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from '../../application/services/dashboard.service';
import { DashboardQueryDto } from '../../application/dto/dashboard-query.dto';
import { DashboardResponseDto } from '../../application/dto/dashboard-response.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get consolidated dashboard metrics' })
  @ApiResponse({ status: 200, type: DashboardResponseDto })
  getDashboard(@Query() query: DashboardQueryDto): DashboardResponseDto {
    return this.dashboardService.getDashboard(query);
  }
}
