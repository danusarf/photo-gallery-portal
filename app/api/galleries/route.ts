import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient, Prisma } from '@prisma/client';
import { generateShareCode } from '@/lib/utils';

const prisma = new PrismaClient();

interface PhotoInput {
  url: string;
  key: string;
  title?: string;
  description?: string;
  publicId?: string;
}

// Extend the session type to include the user ID
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Create a new gallery
// POST /api/galleries
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, description, isPublic, photos } = await request.json() as {
      title: string;
      description?: string;
      isPublic?: boolean;
      photos: PhotoInput[];
    };

    if (!title || !Array.isArray(photos) || photos.length === 0) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Generate a unique share code
    let shareCode: string = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!isUnique && attempts < maxAttempts) {
      shareCode = generateShareCode();
      const existingGallery = await prisma.gallery.findUnique({
        where: { shareCode },
        select: { id: true },
      });
      
      if (!existingGallery) {
        isUnique = true;
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate a unique share code after multiple attempts');
        }
      }
    }
    
    // First create the gallery
    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || null,
        isPublic: !!isPublic,
        isShared: false,
        shareCode,
        viewCount: 0,
        userId: session.user.id,
      },
    });

    // Then create photos with the gallery ID
    if (photos.length > 0) {
      await prisma.photo.createMany({
        data: photos.map((photo) => ({
          url: photo.url,
          key: photo.key,
          title: photo.title || null,
          description: photo.description || null,
          publicId: photo.publicId || photo.key.split('/').pop() || null,
          galleryId: gallery.id,
        })),
      });
    }

    // Fetch the created gallery with photos
    const createdGallery = await prisma.gallery.findUnique({
      where: { id: gallery.id },
      include: { photos: true },
    });

    return NextResponse.json(createdGallery);
  } catch (error) {
    console.error('Error creating gallery:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Get all galleries for the current user
// GET /api/galleries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const galleries = await prisma.gallery.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          take: 1, // Only get the first photo for the thumbnail
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
