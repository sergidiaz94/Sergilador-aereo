import { NextResponse } from 'next/server';
import { getCheapestDealsFromBcn } from '@/services/amadeus/deals.service';
import { hasAmadeus } from '@/lib/env';

export async function GET() {
  const deals = await getCheapestDealsFromBcn();
  return NextResponse.json({ deals, source: hasAmadeus() ? 'live' : 'demo' });
}
