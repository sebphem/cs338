interface Profile {
  name: string;
  age: string;
  bio: string;
  interests: string[];
  lookingFor: string;
  textContent: string; // Original text content that generated this profile
}

interface ProfileFeedback {
  liked: Profile[];
  disliked: Profile[];
}

const userFeedback = new Map<string, ProfileFeedback>();

export function storeProfileFeedback(userId: string, profile: Profile, isLiked: boolean) {
  if (!userFeedback.has(userId)) {
    userFeedback.set(userId, { liked: [], disliked: [] });
  }

  const feedback = userFeedback.get(userId)!;
  if (isLiked) {
    feedback.liked.push(profile);
  } else {
    feedback.disliked.push(profile);
  }
}

export function generateLearningPrompt(userId: string): string {
  const feedback = userFeedback.get(userId);
  if (!feedback || (feedback.liked.length === 0 && feedback.disliked.length === 0)) {
    return '';
  }

  let prompt = 'Based on user feedback:\n\n';

  if (feedback.liked.length > 0) {
    prompt += 'Profiles the user liked:\n';
    feedback.liked.slice(-3).forEach((profile, index) => {
      prompt += `\nLiked Profile ${index + 1}:\n`;
      prompt += `Name: ${profile.name}\n`;
      prompt += `Age: ${profile.age}\n`;
      prompt += `Bio: ${profile.bio}\n`;
      prompt += `Interests: ${profile.interests.join(', ')}\n`;
      prompt += `Looking For: ${profile.lookingFor}\n`;
    });
  }

  if (feedback.disliked.length > 0) {
    prompt += '\nProfiles the user disliked:\n';
    feedback.disliked.slice(-3).forEach((profile, index) => {
      prompt += `\nDisliked Profile ${index + 1}:\n`;
      prompt += `Name: ${profile.name}\n`;
      prompt += `Age: ${profile.age}\n`;
      prompt += `Bio: ${profile.bio}\n`;
      prompt += `Interests: ${profile.interests.join(', ')}\n`;
      prompt += `Looking For: ${profile.lookingFor}\n`;
    });
  }

  prompt += '\nPlease generate a new profile that aligns with the characteristics of liked profiles while avoiding patterns from disliked ones.';
  return prompt;
}

function findCommonElements(items: string[]): string[] {
  const frequency = new Map<string, number>();
  items.forEach(item => {
    frequency.set(item, (frequency.get(item) || 0) + 1);
  });
  
  // Return items that appear more than once
  return Array.from(frequency.entries())
    .filter(([_, count]) => count > 1)
    .map(([item]) => item)
    .slice(0, 5); // Limit to top 5 common elements
}

function getAgeRange(ages: number[]) {
  return {
    min: Math.min(...ages),
    max: Math.max(...ages)
  };
}

function analyzeBioStyle(profiles: Profile[]): string {
  // Simple analysis of bio patterns
  const patterns = profiles.map(p => {
    const wordCount = p.bio.split(' ').length;
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(p.bio);
    const tone = detectTone(p.bio);
    return { wordCount, hasEmoji, tone };
  });

  const avgWordCount = patterns.reduce((sum, p) => sum + p.wordCount, 0) / patterns.length;
  const emojiPreference = patterns.filter(p => p.hasEmoji).length > patterns.length / 2;
  const commonTone = findMostCommon(patterns.map(p => p.tone));

  return `${commonTone} tone, ${emojiPreference ? 'with' : 'without'} emojis, ~${Math.round(avgWordCount)} words`;
}

function detectTone(text: string): string {
  // Simple tone detection based on keywords and patterns
  const lowercase = text.toLowerCase();
  if (lowercase.includes('lol') || lowercase.includes('haha') || /😂|😄|🤣/.test(text)) {
    return 'humorous';
  } else if (lowercase.includes('passionate') || lowercase.includes('love') || lowercase.includes('excited')) {
    return 'enthusiastic';
  } else if (lowercase.includes('seeking') || lowercase.includes('looking for') || lowercase.includes('want to')) {
    return 'direct';
  }
  return 'neutral';
}

function findMostCommon<T>(items: T[]): T {
  const frequency = new Map<T, number>();
  items.forEach(item => {
    frequency.set(item, (frequency.get(item) || 0) + 1);
  });
  return Array.from(frequency.entries())
    .sort(([_, a], [__, b]) => b - a)[0][0];
} 