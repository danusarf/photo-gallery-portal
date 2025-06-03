import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const galleryId = params.id;
    if (!galleryId) {
      return new NextResponse('Gallery ID is required', { status: 400 });
    }

    // Get the gallery with share status
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId, userId: session.user.id },
      select: {
        id: true,
        isShared: true,
        shareCode: true,
      },
    });

    if (!gallery) {
      return new NextResponse('Gallery not found', { status: 404 });
    }

    return NextResponse.json({
      isShared: gallery.isShared,
      shareCode: gallery.shareCode,
    });
  } catch (error) {
    console.error('Error getting gallery share status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
