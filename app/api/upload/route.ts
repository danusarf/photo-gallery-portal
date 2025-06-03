import { NextResponse } from 'next/server';
import { uploadFile, deleteFile } from '@/lib/b2';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const mimeType = formData.get('mimeType') as string;

    if (!file || !fileName) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate a unique file key with user ID and timestamp
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    // Upload to Backblaze B2
    const { url, key } = await uploadFile(buffer, uniqueFileName, mimeType);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new NextResponse('Error uploading file', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { key } = await request.json();
    if (!key) {
      return new NextResponse('No file key provided', { status: 400 });
    }

    // Verify the file belongs to the user
    if (!key.startsWith(session.user.id + '/')) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    await deleteFile(key);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return new NextResponse('Error deleting file', { status: 500 });
  }
}
