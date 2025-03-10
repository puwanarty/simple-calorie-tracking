'use client';

import AdminPage from '@/components/admin-page';
import Loading from '@/components/loading';
import useAuth from '@/hooks/use-auth';
import { notFound } from 'next/navigation';
import React from 'react';

const Page: React.FC = () => {
  const { me } = useAuth();

  const { data, isLoading } = me();

  if (!data || isLoading) return <Loading />;

  if (!data.roles.includes('ADMIN')) return notFound();

  return <AdminPage />;
};

export default Page;
