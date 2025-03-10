'use client';

import useAdmin from '@/hooks/use-admin';
import dayjs from 'dayjs';
import { redirect, RedirectType } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
  name: string;
  calories: number;
  price?: number;
  takenAt: string;
  userId: string;
}

const Page: React.FC = () => {
  const [search, setSearch] = useState('');
  const { createFoodEntry, getUsers } = useAdmin();

  const { data: users } = getUsers(search);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { takenAt: dayjs().format('YYYY-MM-DDTHH:mm') },
  });

  const onSubmit = async (data: FormValues) => {
    const response = await createFoodEntry(data);

    if ('id' in response) redirect('/admin', RedirectType.push);
  };

  useEffect(() => {
    if (users && users.length) {
      reset({ userId: users[0].id });
    } else {
      reset({ userId: '' });
    }
  }, [users]);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center p-4">
      <form
        className="flex w-full max-w-md flex-col gap-2 rounded-md border border-gray-200 bg-white p-4 shadow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="text-2xl font-bold text-blue-500">New Food Entry (Admin)</p>
        <input
          id="username"
          type="text"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Name"
          {...register('name', { required: true })}
        />
        <input
          id="calories"
          type="number"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Calories"
          {...register('calories', { required: true })}
        />
        <input
          id="price"
          type="number"
          step="0.01"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Price"
          {...register('price')}
        />
        <input
          id="takenAt"
          type="datetime-local"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Taken At"
          {...register('takenAt', { required: true })}
        />
        <input
          id="search"
          type="text"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Enter username if you don't see the user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          id="userId"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          {...register('userId', { required: true })}
        >
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        {errors.root && <p className="text-sm text-red-500 italic">{errors.root.message}</p>}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="rounded-md border border-blue-500 p-2 font-bold text-blue-500 uppercase"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
