import { NextResponse } from 'next/server';
import { getNextRcdeTourPlan } from '@/services/football/fixtures.service';

export async function GET() {
  const plan = await getNextRcdeTourPlan();
  return NextResponse.json(plan);
}
