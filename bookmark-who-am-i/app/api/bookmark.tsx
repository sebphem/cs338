'use server'; //Important to mark as server component

export async function getChatResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch chat response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in getChatResponse:', error);

    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else if (error instanceof TypeError) {
      return `Type Error: ${error.message}`;
    } else if (typeof error === 'string') {
        return `Error: ${error}`;
    } else {
      return 'An unknown error occurred.';
    }
  }
}