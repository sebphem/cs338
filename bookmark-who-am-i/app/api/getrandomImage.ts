'use server'; // Marks this function as a server action

export async function getRandomImage(): Promise<string | null> {
  try {
    const response = await fetch('http://localhost:3000/api/ori', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch image');
    }

    const data = await response.json();
    return data.file; // The path of the image
  } catch (error) {
    console.error('Error in getRandomImage:', error);
    return null;
  }
}
