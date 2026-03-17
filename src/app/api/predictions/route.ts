import { NextRequest, NextResponse } from 'next/server';
import { fetchPredictions } from '@/lib/api-football';

export async function GET(request: NextRequest) {
  const fixtureId = request.nextUrl.searchParams.get('fixture');

  if (!fixtureId) {
    return NextResponse.json({ error: 'Fixture parameter is required' }, { status: 400 });
  }

  try {
    const prediction = await fetchPredictions(parseInt(fixtureId));
    return NextResponse.json({ response: prediction });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch predictions', details: String(error) },
      { status: 500 }
    );
  }
}
