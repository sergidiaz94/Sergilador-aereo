import { env } from '@/lib/env';

export async function aeroDataBoxGet<T>(path: string): Promise<T> {
  const res = await fetch(`https://aerodatabox.p.rapidapi.com${path}`, {
    headers: {
      'X-RapidAPI-Key': env.aerodatabox.rapidApiKey!,
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`AeroDataBox request failed: ${res.status}`);
  }

  return res.json();
}
