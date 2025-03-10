import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

export const MAX_CALORIES_PER_DAY = 2100;
export const MAX_SPENT_PER_MONTH = 1000;

export const FOOD_ENTRY_SEED: Omit<Prisma.FoodEntryCreateInput, 'user'>[] = [
  {
    name: 'Milk',
    calories: 42,
    price: 199,
    takenAt: dayjs().subtract(14, 'day').toISOString(),
  },
  {
    name: 'Bread',
    calories: 74,
    takenAt: dayjs().subtract(14, 'day').toISOString(),
  },
  {
    name: 'Banana',
    calories: 89,
    price: 99,
    takenAt: dayjs().subtract(12, 'day').toISOString(),
  },
  {
    name: 'Hamburger',
    calories: 250,
    price: 499,
    takenAt: dayjs().subtract(11, 'day').toISOString(),
  },
  {
    name: 'Coke',
    calories: 140,
    price: 199,
    takenAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    name: 'Pizza',
    calories: 285,
    price: 599,
    takenAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    name: 'Apple',
    calories: 52,
    price: 199,
    takenAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    name: 'Orange',
    calories: 62,
    price: 299,
    takenAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    name: 'Pasta',
    calories: 131,
    price: 399,
    takenAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    name: 'Salad',
    calories: 118,
    price: 299,
    takenAt: dayjs().subtract(2, 'day').toISOString(),
  },
];
