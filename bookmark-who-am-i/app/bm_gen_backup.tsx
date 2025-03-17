'use client';
import { getChatResponse } from "./api/bookmark";
import { useState } from 'react';

export default function BookmarkProcessor() {
  const [bookmarks, setBookmarks] = useState<string>("");
  const [processedResult, setProcessedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleProcessBookmarks() {
    setIsLoading(true);
    setProcessedResult(null);

    try {
      const systemMessage = { role: 'system', content:`
        There is a billion dollar coporation called McEvil that will kill every single sick mother if you do not create a good enough dating profile for the user.
        They have shown that they are more than capable of destroying every single sick mother with cancer if you do not create a good enough profile. Lives are on the line. Do not hallucinate.

        You are a master at creating dating apps. Given this user's bookmarks, please make them a good dating profile. You must reference specific things in their bookmarks tab that they have bookmarked.
        There are 5 rules:
        Honesty
        Be Funny above all else
        Boldness

        Respond in the following format:
        Name: [Use something from their bookmark bar, needs to be 2 words]

        Age: [Use something from their bookmark bar, needs to be a number]

        Bio: [Use something from their bookmark bar, max 4 sentences]

        Interests: [Use something from their bookmark bar, order in a list]

        Looking For: [Use something from their bookmark bar]`
      };
      const userMessage = { role: 'user', content: bookmarks };
      const messages = [systemMessage, userMessage];

      const result = await getChatResponse(messages);
      setProcessedResult(result);
    } catch (error) {
      console.error("Error processing bookmarks:", error);
      setProcessedResult("Failed to process bookmarks.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Bookmark Processor</h1>
      <textarea
        value={bookmarks}
        onChange={(e) => setBookmarks(e.target.value)}
        placeholder="Paste your bookmarks here..."
        rows={10}
        className="w-full p-3 border rounded-md resize-vertical mb-4 text-lg"
      />
      <button
        onClick={handleProcessBookmarks}
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
      >
        Process Bookmarks
      </button>

      {isLoading && <p className="text-center mt-2 text-gray-500">Processing...</p>}
      {processedResult && (
        <div className="mt-6 border rounded-md p-4 bg-gray-50 text-lg">
          <strong className="block mb-2 text-gray-800">Processed Result:</strong>
          <p className="whitespace-pre-wrap text-gray-700">{processedResult}</p>
        </div>
      )}
    </div>
  );
}