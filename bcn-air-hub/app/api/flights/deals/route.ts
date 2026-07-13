import { NextResponse } from 'next/server';
import { getCheapestDealsFromBcn } from '@/services/travelpayouts/deals.service';
import { hasTravelpayouts } from '@/lib/env';

export async function GET() {
  const deals = await getCheapestDealsFromBcn();
  return NextResponse.json({ deals, source: hasTravelpayouts() ? 'live' : 'demo' });
}
