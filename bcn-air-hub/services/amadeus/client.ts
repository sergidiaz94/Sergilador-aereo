import { env } from '@/lib/env';

let cachedToken: { value: string; expiresAt: number } | null = null;

async function fetchToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const res = await fetch(`${env.amadeus.baseUrl}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.amadeus.apiKey!,
      client_secret: env.amadeus.apiSecret!,
    }),
  });

  if (!res.ok) {
    throw new Error(`Amadeus auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export async function amadeusGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const token = await fetchToken();
  const url = new URL(`${env.amadeus.baseUrl}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Amadeus request failed: ${res.status}`);
  }

  return res.json();
}
