import { AI_RESPONSES, FALLBACK_RESPONSES } from '../data/aiResponses';

export function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const words = lower.split(/\s+/);

  let bestMatch: { response: string; score: number } | null = null;

  for (const entry of AI_RESPONSES) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        const score = keyword.length; // longer keyword = more specific match
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { response: entry.response, score };
        }
      }
    }
  }

  if (bestMatch) return bestMatch.response;

  // Check for price-related queries
  if (words.some(w => ['price', 'cost', 'how much', 'cheap', 'affordable', 'expensive'].includes(w))) {
    return 'Use our Compare Prices feature to see pricing across all stores! Click the ⚖️ Compare button on any product card or visit the Compare page. Prices often vary 10-20% between stores. 💰';
  }

  // Check for availability queries
  if (words.some(w => ['available', 'availability', 'stock', 'in stock'].includes(w))) {
    return 'Product availability is shown in real-time on each product card. Look for the green "In Stock" badge. You can also use the "In Stock Only" filter when browsing. Stock levels are updated by each store regularly. 📦';
  }

  // Random fallback
  const idx = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return FALLBACK_RESPONSES[idx];
}
