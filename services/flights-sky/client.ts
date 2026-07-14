import { env } from '@/lib/env';

const HOST = 'flights-sky.p.rapidapi.com';

export async function flightsSkyGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`https://${HOST}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-host': HOST,
      'x-rapidapi-key': env.flightsSky.rapidApiKey!,
    },
  });

  if (!res.ok) {
    throw new Error(`flights-sky request failed: ${res.status}`);
  }

  return res.json();
}
