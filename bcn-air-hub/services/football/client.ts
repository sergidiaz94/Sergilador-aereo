import { env } from '@/lib/env';

export async function footballDataGet<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.football-data.org/v4${path}`, {
    headers: { 'X-Auth-Token': env.footballData.apiKey! },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`football-data.org request failed: ${res.status}`);
  }

  return res.json();
}
