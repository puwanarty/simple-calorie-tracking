import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { FoodEntryService } from './food-entry.service';
import {
  CreateFoodEntryDto,
  GetFoodEntriesQuery,
  GetFoodEntriesStatsQuery,
  UpdateFoodEntryDto,
} from './food-entry.dto';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
import { UserEntity } from 'src/user/user.dto';
import { User } from 'src/user/user.decorator';
import { MAX_CALORIES_PER_DAY, MAX_SPENT_PER_MONTH } from './food-entry.constant';

@Controller('food-entry')
export class FoodEntryController {
  constructor(private readonly foodEntryService: FoodEntryService) {}

  @Get()
  async getFoodEntries(@User() user: UserEntity, @Query() query: GetFoodEntriesQuery) {
    const { skip, take, start, end } = query;

    const { sub } = user;

    const args: Prisma.FoodEntryFindManyArgs = {
      skip,
      take,
      where: {
        takenAt: {
          ...(start && { gte: dayjs(start).startOf('day').toDate() }),
          ...(end && { lte: dayjs(end).endOf('day').toDate() }),
        },
        userId: sub,
      },
      orderBy: [{ createdAt: 'desc' }, { takenAt: 'desc' }],
      include: { user: { select: { id: true, username: true } } },
    };

    return this.foodEntryService.getFoodEntries(args);
  }

  @Get('stats')
  async getFoodEntriesStats(@User() user: UserEntity, @Query() query: GetFoodEntriesStatsQuery) {
    const { date: _date } = query;

    const date = _date || dayjs().format('YYYY-MM-DD');

    const { sub } = user;

    const [totalCaloriesPerDate, totalSpentPerMonth] = await Promise.all([
      this.foodEntryService.calculateTotalCaloriesPerDate(date, sub),
      this.foodEntryService.calculateTotalSpentPerMonth(date, sub),
    ]);

    return {
      isReachedMaxCaloriesToday: totalCaloriesPerDate >= MAX_CALORIES_PER_DAY,
      isReachedMaxSpentPerMonth: totalSpentPerMonth / 100 >= MAX_SPENT_PER_MONTH,
      maxCaloriesPerDay: MAX_CALORIES_PER_DAY,
      maxSpentPerMonth: MAX_SPENT_PER_MONTH,
    };
  }

  @Get('seed')
  async seedFoodEntries() {
    return this.foodEntryService.seedFoodEntries();
  }

  @Get(':id')
  async getFoodEntryById(@User() user: UserEntity, @Param('id') id: string) {
    const foodEntry = await this.foodEntryService.getFoodEntryById(id);

    if (!foodEntry) throw new NotFoundException();

    if (foodEntry.userId !== user.sub) throw new UnauthorizedException();

    return foodEntry;
  }

  @Post()
  async createFoodEntry(@Body() body: CreateFoodEntryDto) {
    const { userId, ...rest } = body;

    const dto = { ...rest, user: { connect: { id: userId } } };

    return this.foodEntryService.createFoodEntry(dto);
  }

  @Put(':id')
  async updateFoodEntry(@Param('id') id: string, @Body() data: UpdateFoodEntryDto) {
    const foodEntry = await this.foodEntryService.getFoodEntryById(id);

    if (!foodEntry) throw new NotFoundException();

    // todo: accept token from header and validate user

    const { userId, ...rest } = data;

    const dto = { ...rest, user: { connect: { id: userId } } };

    return this.foodEntryService.updateFoodEntry(id, dto);
  }

  @Delete(':id')
  async deleteFoodEntry(@Param('id') id: string) {
    const foodEntry = await this.foodEntryService.getFoodEntryById(id);

    if (!foodEntry) throw new NotFoundException();

    // todo: accept token from header and validate user

    return this.foodEntryService.deleteFoodEntry(id);
  }
}
