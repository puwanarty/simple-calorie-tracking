'use client';

import useAuth from '@/hooks/use-auth';
import { setCookie } from 'cookies-next';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
  password: string;
};

const Page: React.FC = () => {
  const { signin } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const response = await signin(data.username, data.password);

    if ('access_token' in response) {
      setCookie('access_token', response.access_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      redirect('/dashboard', RedirectType.push);
    }

    if ('statusCode' in response) {
      setError('root', { message: 'Invalid username or password' });
    }
  };

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center p-4">
      <form
        className="flex w-full max-w-md flex-col gap-2 rounded-md border border-gray-200 bg-white p-4 shadow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="text-2xl font-bold text-blue-500">Login</p>
        <input
          id="username"
          type="text"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Enter your username"
          {...register('username', { required: true })}
        />
        <input
          id="password"
          type="password"
          className={`rounded-md border p-2 ${errors.root ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Enter your password"
          {...register('password', { required: true })}
        />
        {errors.root && <p className="text-sm text-red-500 italic">{errors.root.message}</p>}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="rounded-md border border-blue-500 p-2 font-bold text-blue-500 uppercase"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Page;
