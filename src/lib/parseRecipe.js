/**
 * Uses the Anthropic API to parse recipe data from an Instagram URL + caption.
 * Since Instagram blocks direct scraping, we ask the user to also paste the
 * caption/description, then Claude extracts structured recipe data from it.
 */
export async function parseInstagramRecipe({ url, caption }) {
  const prompt = `You are a recipe extraction assistant. Given an Instagram post URL and caption/description, extract a structured recipe.

Instagram URL: ${url}
Caption/Description: ${caption || '(none provided)'}

Extract and return ONLY a JSON object with this exact structure:
{
  "title": "Recipe name",
  "description": "Brief description (1-2 sentences)",
  "servings": "e.g. 4 servings",
  "prep_time": "e.g. 15 mins",
  "cook_time": "e.g. 30 mins",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["Step 1 description", "Step 2 description"],
  "tags": ["tag1", "tag2"],
  "source_url": "${url}"
}

If information is missing, use null for that field. Return ONLY the JSON, no markdown, no explanation.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to parse recipe with AI')
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('AI returned unexpected format')
  }
}
