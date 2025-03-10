import { Food, Pagination } from '@/interfaces';
import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import useSWR from 'swr';

const PER_PAGE = 5;

interface FoodEntriesResponse {
  data: Food[];
  pagination: Pagination;
}

const useFoodEntry = () => {
  const token = getCookie('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const getFoodEntries = (page: number, start: string, end: string) => {
    const startDate = dayjs(start).format('YYYY-MM-DD');
    const endDate = dayjs(end).format('YYYY-MM-DD');
    const skip = (page - 1) * PER_PAGE;

    return useSWR<FoodEntriesResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/food-entry?start=${startDate}&end=${endDate}&skip=${skip}&take=${PER_PAGE}`,
      async (url: string) => {
        const response = await fetch(url, { headers });

        if (!response.ok) throw new Error();

        const { data, pagination } = await response.json();

        const parsed = data.map((food: Food) => ({ ...food, price: (food.price || 0) / 100 }));

        return { data: parsed, pagination };
      },
    );
  };

  const getFoodEntry = (id: string) => {
    return useSWR<Food>(`${process.env.NEXT_PUBLIC_API_URL}/food-entry/${id}`, async (url: string) => {
      const response = await fetch(url, { headers });

      if (!response.ok) throw new Error();

      const food = await response.json();

      return { ...food, price: (food.price || 0) / 100 };
    });
  };

  const getFoodEntryStats = () => {
    return useSWR<{
      isReachedMaxCaloriesToday: boolean;
      isReachedMaxSpentPerMonth: boolean;
      maxCaloriesPerDay: number;
      maxSpentPerMonth: number;
    }>(`${process.env.NEXT_PUBLIC_API_URL}/food-entry/stats`, async (url: string) => {
      const response = await fetch(url, { headers });

      if (!response.ok) throw new Error();

      const { isReachedMaxCaloriesToday, isReachedMaxSpentPerMonth, maxCaloriesPerDay, maxSpentPerMonth } =
        await response.json();

      return { isReachedMaxCaloriesToday, isReachedMaxSpentPerMonth, maxCaloriesPerDay, maxSpentPerMonth };
    });
  };

  const createFoodEntry = async (data: any) => {
    const dto = {
      ...data,
      price: data.price ? data.price * 100 : undefined,
      takenAt: dayjs(data.takenAt).toISOString(),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food-entry`, {
      method: 'POST',
      headers,
      body: JSON.stringify(dto),
    });

    if (!response.ok) throw new Error();

    return response.json();
  };

  const updateFoodEntry = async (id: string, data: any) => {
    const dto = {
      ...data,
      price: (data.price || 0) * 100,
      takenAt: dayjs(data.takenAt).toISOString(),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food-entry/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(dto),
    });

    if (!response.ok) throw new Error();

    return response.json();
  };

  const deleteFoodEntry = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food-entry/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) throw new Error();

    return response.json();
  };

  return { getFoodEntries, getFoodEntryStats, createFoodEntry, deleteFoodEntry, updateFoodEntry, getFoodEntry };
};

export default useFoodEntry;
