import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { deleteFile } from '@/lib/b2';

// GET /api/galleries/[id] - Get a specific gallery by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    // Find the gallery with the given ID
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: { photos: true },
    });

    // If gallery doesn't exist, return 404
    if (!gallery) {
      return new NextResponse('Gallery not found', { status: 404 });
    }

    // If gallery is not public and user is not the owner, return 403
    if (!gallery.isPublic && session?.user?.id !== gallery.userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH /api/galleries/[id] - Update a gallery
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;
    const { title, description, isPublic, photos } = await request.json();

    // Check if the gallery exists and the user is the owner
    const existingGallery = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existingGallery) {
      return new NextResponse('Gallery not found', { status: 404 });
    }

    if (existingGallery.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Update the gallery
    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        isPublic,
      },
      include: { photos: true },
    });

    return NextResponse.json(updatedGallery);
  } catch (error) {
    console.error('Error updating gallery:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/galleries/[id] - Delete a gallery
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    // Check if the gallery exists and the user is the owner
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!gallery) {
      return new NextResponse('Gallery not found', { status: 404 });
    }

    if (gallery.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Delete all photos from storage
    await Promise.all(
      gallery.photos.map((photo) => deleteFile(photo.key).catch(console.error))
    );

    // Delete the gallery (this will cascade delete photos due to the relation)
    await prisma.gallery.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
