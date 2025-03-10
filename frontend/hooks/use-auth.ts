import { getCookie } from 'cookies-next';
import useSWR from 'swr';

const useAuth = () => {
  const signin = async (username: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    return response.json();
  };

  const me = () =>
    useSWR<{ sub: string; username: string; roles: string[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      async (url: string) => {
        const token = getCookie('access_token');

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(url, { headers });

        if (!response.ok) throw new Error();

        return response.json();
      },
    );

  return { signin, me };
};

export default useAuth;
