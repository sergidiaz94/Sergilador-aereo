import { env } from '@/lib/env';

export async function travelpayoutsGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`https://api.travelpayouts.com${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set('token', env.travelpayouts.apiToken!);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Travelpayouts request failed: ${res.status}`);
  }

  return res.json();
}
