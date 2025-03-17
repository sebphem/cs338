import { NextRequest, NextResponse } from 'next/server';
import { getRandomDriveImage, getRandomTextContent } from '../googleDrive';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const [imageUrl, textContent] = await Promise.all([
      getRandomDriveImage(session.accessToken as string),
      getRandomTextContent(session.accessToken as string)
    ]);
    
    if (!imageUrl || !textContent) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch content from Google Drive' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      fileUrl: imageUrl,
      textContent: textContent
    });
  } catch (error) {
    console.error('Error in drive route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 