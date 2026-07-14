import { NextResponse } from 'next/server';
import { getRcdeUpcomingFixtures } from '@/services/football/fixtures.service';

export async function GET() {
  const result = await getRcdeUpcomingFixtures();
  return NextResponse.json(result);
}
