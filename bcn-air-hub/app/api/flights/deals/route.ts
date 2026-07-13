import { NextResponse } from 'next/server';
import { getCheapestWeekendDealsFromBcn } from '@/services/travelpayouts/deals.service';
import { hasTravelpayouts } from '@/lib/env';

export async function GET() {
  const deals = await getCheapestWeekendDealsFromBcn();
  return NextResponse.json({ deals, source: hasTravelpayouts() ? 'live' : 'demo' });
}
