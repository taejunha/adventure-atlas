import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';


// responsible for getting the locations for the user logged in
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId'); // retrieves the userId that was sent from the front end

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // grabs all the locations from Prisma that is associated with the userId
    const locations = await prisma.location.findMany({
      where: { userId },
      include: {
        photos: true,
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations', details: (error as Error).message },
      { status: 500 }
    );
  }
}
