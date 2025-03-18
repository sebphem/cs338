import { NextRequest, NextResponse } from 'next/server';
import { storeProfileFeedback, generateLearningPrompt } from '../profileLearning';

export async function POST(request: NextRequest) {
  try {
    const { userId, profile, isLiked } = await request.json();

    if (!userId || !profile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the feedback
    storeProfileFeedback(userId, profile, isLiked);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in profile-feedback route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 