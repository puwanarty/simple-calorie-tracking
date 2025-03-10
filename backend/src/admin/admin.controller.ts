import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FoodEntryService } from 'src/food-entry/food-entry.service';
import { getAdminFoodEntriesStatsQuery } from './admin.dto';
import dayjs from 'dayjs';
import { CreateFoodEntryDto, GetFoodEntriesQuery, UpdateFoodEntryDto } from 'src/food-entry/food-entry.dto';
import { Prisma } from '@prisma/client';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly foodEntryService: FoodEntryService,
  ) {}

  @Get()
  async getAdminFoodEntries(@Query() query: GetFoodEntriesQuery) {
    const { skip, take, start, end } = query;

    const args: Prisma.FoodEntryFindManyArgs = {
      skip,
      take,
      where: {
        takenAt: {
          ...(start && { gte: dayjs(start).startOf('day').toDate() }),
          ...(end && { lte: dayjs(end).endOf('day').toDate() }),
        },
      },
      orderBy: [{ createdAt: 'desc' }, { takenAt: 'desc' }],
      include: { user: { select: { id: true, username: true } } },
    };

    return this.foodEntryService.getFoodEntries(args);
  }

  @Get('stats')
  async getAdminFoodEntriesStats(@Query() query: getAdminFoodEntriesStatsQuery) {
    const { date } = query;

    const thisWeek = dayjs(date).format('YYYY-MM-DD');
    const lastWeek = dayjs(thisWeek).subtract(1, 'week').format('YYYY-MM-DD');

    const [totalFoodEntriesThisWeek, totalFoodEntriesLastWeek, averageCaloriesThisWeek] = await Promise.all([
      this.foodEntryService.calculateTotalFoodEntriesPerWeek(thisWeek),
      this.foodEntryService.calculateTotalFoodEntriesPerWeek(lastWeek),
      this.foodEntryService.calculateAverageCaloriesPerWeek(thisWeek),
    ]);

    return { totalFoodEntriesThisWeek, totalFoodEntriesLastWeek, averageCaloriesThisWeek };
  }

  @Get(':id')
  async getAdminFoodEntry(@Param('id') id: string) {
    return this.foodEntryService.getFoodEntryById(id);
  }

  @Post()
  async createAdminFoodEntry(@Body() body: CreateFoodEntryDto) {
    const { userId, ...rest } = body;

    const dto = { ...rest, user: { connect: { id: userId } } };

    return this.foodEntryService.createFoodEntry(dto);
  }

  @Put(':id')
  async updateFoodEntry(@Param('id') id: string, @Body() data: UpdateFoodEntryDto) {
    const foodEntry = await this.foodEntryService.getFoodEntryById(id);

    if (!foodEntry) throw new NotFoundException();

    const { userId, ...rest } = data;

    const dto = { ...rest, user: { connect: { id: userId } } };

    return this.foodEntryService.updateFoodEntry(id, dto);
  }

  @Delete(':id')
  async deleteFoodEntry(@Param('id') id: string) {
    const foodEntry = await this.foodEntryService.getFoodEntryById(id);

    if (!foodEntry) throw new NotFoundException();

    return this.foodEntryService.deleteFoodEntry(id);
  }
}
