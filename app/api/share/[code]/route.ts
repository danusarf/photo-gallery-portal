import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/share/[code] - Get a gallery by share code
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    // Find the gallery with the given share code
    const gallery = await prisma.gallery.findFirst({
      where: { shareCode: code },
      include: {
        photos: {
          select: {
            id: true,
            url: true,
            title: true,
            description: true,
            key: false, // Don't expose the B2 key
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!gallery) {
      return new NextResponse('Gallery not found', { status: 404 });
    }

    // If gallery is not public and not shared, return 404 (don't reveal existence)
    if (!gallery.isPublic && !gallery.isShared) {
      return new NextResponse('Gallery not found', { status: 404 });
    }

    // Increment the view count
    await prisma.gallery.update({
      where: { id: gallery.id },
      data: { viewCount: { increment: 1 } },
    });

    // Return the gallery data without sensitive information
    const { userId, isShared, shareCode, ...galleryData } = gallery;
    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Error fetching shared gallery:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
