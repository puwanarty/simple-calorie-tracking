import { Injectable } from '@nestjs/common';
import { FoodEntry, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FOOD_ENTRY_SEED } from './food-entry.constant';
import { UserService } from 'src/user/user.service';
import { Pagination } from 'src/common/pagination.interface';
import dayjs from 'dayjs';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/common/common.constant';

@Injectable()
export class FoodEntryService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getFoodEntries(args?: Prisma.FoodEntryFindManyArgs): Promise<{ data: FoodEntry[]; pagination: Pagination }> {
    const { skip = DEFAULT_SKIP, take = DEFAULT_TAKE, where, ...rest } = args || {};

    const [data, total] = await Promise.all([
      this.prisma.foodEntry.findMany({ skip, take, where, ...rest }),
      this.prisma.foodEntry.count({ where }),
    ]);

    return {
      data,
      pagination: {
        currentPage: Math.ceil(skip / take) + 1,
        perPage: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getFoodEntryById(id: string): Promise<FoodEntry | null> {
    return this.prisma.foodEntry.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });
  }

  async createFoodEntry(data: Prisma.FoodEntryCreateInput): Promise<FoodEntry> {
    return this.prisma.foodEntry.create({ data });
  }

  async updateFoodEntry(id: string, data: Prisma.FoodEntryUpdateInput): Promise<FoodEntry> {
    return this.prisma.foodEntry.update({ where: { id }, data });
  }

  async deleteFoodEntry(id: string): Promise<FoodEntry> {
    return this.prisma.foodEntry.delete({ where: { id } });
  }

  async calculateTotalCaloriesPerDate(date: string, userId: string): Promise<number> {
    const result = await this.prisma.foodEntry.aggregate({
      where: {
        takenAt: {
          gte: dayjs(date).startOf('day').toDate(),
          lte: dayjs(date).endOf('day').toDate(),
        },
        userId,
      },
      _sum: {
        calories: true,
      },
    });

    return result._sum.calories || 0;
  }

  async calculateTotalSpentPerMonth(date: string, userId: string): Promise<number> {
    const result = await this.prisma.foodEntry.aggregate({
      where: {
        takenAt: {
          gte: dayjs(date).startOf('month').toDate(),
          lte: dayjs(date).endOf('month').toDate(),
        },
        userId,
      },
      _sum: {
        price: true,
      },
    });

    return result._sum.price || 0;
  }

  async calculateTotalFoodEntriesPerWeek(date: string): Promise<number> {
    return this.prisma.foodEntry.count({
      where: {
        takenAt: {
          gte: dayjs(date).subtract(1, 'week').toDate(),
          lte: dayjs(date).toDate(),
        },
      },
    });
  }

  async calculateAverageCaloriesPerWeek(date: string): Promise<number> {
    const result = await this.prisma.foodEntry.groupBy({
      by: ['userId'],
      where: {
        takenAt: {
          gte: dayjs(date).subtract(1, 'week').toDate(),
          lte: dayjs(date).toDate(),
        },
      },
      _avg: {
        calories: true,
      },
    });

    return result.reduce((acc, { _avg }) => acc + (_avg.calories || 0), 0) / result.length;
  }

  async seedFoodEntries(): Promise<FoodEntry[]> {
    await this.prisma.foodEntry.deleteMany();

    const users = await this.userService.getUsers();

    return Promise.all(
      users.map((user) =>
        Promise.all(
          FOOD_ENTRY_SEED.map((food) => this.createFoodEntry({ ...food, user: { connect: { id: user.id } } })),
        ),
      ),
    ).then((foods) => foods.flat());
  }
}
