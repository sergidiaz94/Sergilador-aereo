import { env } from '@/lib/env';

const HOST = 'flight-tracker-live.p.rapidapi.com';

export async function flightTrackerSearch(body: Record<string, unknown>): Promise<any> {
  const res = await fetch(`https://${HOST}/api/flight-tracker/search`, {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': env.flightTrackerLive.rapidApiKey!,
      'X-RapidAPI-Host': HOST,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`flight-tracker-live request failed: ${res.status} ${text}`);
  }

  return res.json();
}
