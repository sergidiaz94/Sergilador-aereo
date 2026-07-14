import { env, hasOpenSkyAuth } from '@/lib/env';

const OPENSKY_TOKEN_URL =
  'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';

let cachedToken: { value: string; expiresAt: number } | null = null;

async function fetchToken(): Promise<string | null> {
  if (!hasOpenSkyAuth()) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const res = await fetch(OPENSKY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.opensky.clientId!,
      client_secret: env.opensky.clientSecret!,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.value;
}

type BoundingBox = { lamin: number; lomin: number; lamax: number; lomax: number };

export async function openSkyGetStates(bbox: BoundingBox) {
  const token = await fetchToken();
  const url = new URL('https://opensky-network.org/api/states/all');
  url.searchParams.set('lamin', String(bbox.lamin));
  url.searchParams.set('lomin', String(bbox.lomin));
  url.searchParams.set('lamax', String(bbox.lamax));
  url.searchParams.set('lomax', String(bbox.lomax));

  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 15 },
  });

  if (!res.ok) {
    throw new Error(`OpenSky request failed: ${res.status}`);
  }

  return res.json();
}
