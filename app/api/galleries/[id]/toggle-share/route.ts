import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
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

    // Verify the gallery belongs to the user
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId, userId: session.user.id },
    });

    if (!gallery) {
      return new NextResponse('Gallery not found', { status: 404 });
    }

    // Toggle the isShared status
    const updatedGallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: { isShared: !gallery.isShared },
    });

    return NextResponse.json({
      success: true,
      isShared: updatedGallery.isShared,
      shareCode: updatedGallery.shareCode,
    });
  } catch (error) {
    console.error('Error toggling gallery share status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
