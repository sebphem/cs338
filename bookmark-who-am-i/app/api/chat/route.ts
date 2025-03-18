import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { generateLearningPrompt } from '../profileLearning';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { messages } = await request.json();

    // Get learning prompt based on user's previous swipes
    const learningPrompt = generateLearningPrompt(session.user.email);
    
    // Add learning context to the system message if available
    if (learningPrompt) {
      const systemMessage = messages.find((m: any) => m.role === 'system');
      if (systemMessage) {
        systemMessage.content = `${systemMessage.content}\n\n${learningPrompt}`;
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return new NextResponse(completion.choices[0].message.content);
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}