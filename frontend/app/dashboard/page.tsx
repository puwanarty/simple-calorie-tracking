'use client';

import Loading from '@/components/loading';
import useFoodEntry from '@/hooks/use-food-entry';
import dayjs from 'dayjs';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react';

const Page: React.FC = () => {
  const [start, setStart] = React.useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [end, setEnd] = React.useState(dayjs().format('YYYY-MM-DD'));
  const [page, setPage] = React.useState(1);

  const { getFoodEntries, getFoodEntryStats, deleteFoodEntry } = useFoodEntry();

  const { data, mutate, isLoading } = getFoodEntries(page, start, end);
  const { data: stats, mutate: mutateStats, isLoading: isLoadingStats } = getFoodEntryStats();

  const onCreate = () => redirect('/dashboard/new', RedirectType.push);

  const onEdit = (id: string) => redirect(`/dashboard/${id}`, RedirectType.push);

  const onDelete = async (id: string) => {
    await deleteFoodEntry(id);
    mutate();
    mutateStats();
  };

  if (isLoading || isLoadingStats) return <Loading />;

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-2 p-4">
      {stats?.isReachedMaxCaloriesToday && (
        <div className="w-full rounded-md border border-yellow-500 bg-yellow-100 p-2 text-center text-sm">
          <b>Alert:</b> You've reached your daily calorie limit of <b>{stats.maxCaloriesPerDay}</b> calories today.
        </div>
      )}
      {stats?.isReachedMaxSpentPerMonth && (
        <div className="w-full rounded-md border border-yellow-500 bg-yellow-100 p-2 text-center text-sm">
          <b>Alert:</b> You've hit your monthly food budget limit of <b>${stats.maxSpentPerMonth}</b>.
        </div>
      )}
      <div className="flex w-full flex-col gap-4 rounded-md border border-gray-200 bg-white py-4 shadow">
        <div className="flex justify-between px-4">
          <div className="flex gap-2">
            <input
              type="date"
              className="rounded-md border border-gray-200 p-2"
              value={start || ''}
              onChange={(e) => setStart(e.target.value)}
            />
            <input
              type="date"
              className="rounded-md border border-gray-200 p-2"
              value={end || ''}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <button
            className="rounded-md border border-blue-500 p-2 font-bold text-blue-500 uppercase"
            onClick={onCreate}
          >
            Add Entry
          </button>
        </div>
        <table className="w-full table-fixed">
          <thead>
            <tr className="h-8 bg-blue-100 text-left text-gray-500 [&>th]:p-2">
              <th>Name</th>
              <th>Calories</th>
              <th>Price</th>
              <th>Taken At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((food) => (
              <tr key={food.id} className="[&>td]:p-2">
                <td className="font-bold">{food.name}</td>
                <td>{food.calories}</td>
                <td>${food.price}</td>
                <td>{dayjs(food.takenAt).format('YYYY-MM-DD HH:mm')}</td>
                <td className="flex gap-2">
                  <button
                    className="rounded-md border border-blue-500 p-1 text-sm font-bold text-blue-500 uppercase"
                    onClick={() => onEdit(food.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-md border border-red-500 p-1 text-sm font-bold text-red-500 uppercase"
                    onClick={() => onDelete(food.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-4 px-4">
          <button
            className="rounded-md border border-blue-500 p-1 text-sm font-bold text-blue-500 uppercase"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="text-xl font-bold">
            Page {page} of {data?.pagination.totalPages}
          </span>
          <button
            className="rounded-md border border-blue-500 p-1 font-bold text-blue-500 uppercase"
            disabled={data?.pagination.totalPages === page}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
