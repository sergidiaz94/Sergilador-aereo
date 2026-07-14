// adsb.fi: projecte comunitari obert i gratuït, sense clau, compatible amb
// el format de l'API v2 d'ADSBexchange.
export async function adsbFiGet(lat: number, lon: number, distNm: number): Promise<any> {
  const url = `https://opendata.adsb.fi/api/v3/lat/${lat}/lon/${lon}/dist/${distNm}`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`adsb.fi request failed: ${res.status} ${text}`);
  }

  return res.json();
}
