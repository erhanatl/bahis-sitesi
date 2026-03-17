import { NextRequest, NextResponse } from 'next/server';
import { fetchFixturesByDate } from '@/lib/api-football';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const fixtures = await fetchFixturesByDate(date);
    return NextResponse.json({ response: fixtures });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch fixtures', details: String(error) },
      { status: 500 }
    );
  }
}
