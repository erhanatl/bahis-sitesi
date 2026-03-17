import { NextRequest, NextResponse } from 'next/server';
import { fetchOdds } from '@/lib/api-football';

export async function GET(request: NextRequest) {
  const fixtureId = request.nextUrl.searchParams.get('fixture');

  if (!fixtureId) {
    return NextResponse.json({ error: 'Fixture parameter is required' }, { status: 400 });
  }

  try {
    const odds = await fetchOdds(parseInt(fixtureId));
    return NextResponse.json({ response: odds });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch odds', details: String(error) },
      { status: 500 }
    );
  }
}
