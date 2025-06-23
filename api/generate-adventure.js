const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Prompt character limit (to prevent overuse)
const MAX_PROMPT_LENGTH = 3000;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const {
    ruleset,
    numPlayers,
    experienceLevel,
    averageLevel,
    genre,
    theme,
    tone,
    worldStyle,
    sceneBlocks,
    detailLevel
  } = req.body;

  if (!sceneBlocks || !Array.isArray(sceneBlocks) || sceneBlocks.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid sceneBlocks array.' });
  }

  // Construct structured prompt
  let prompt = `
You are a professional Game Master using the ${ruleset} system.

Design a one-shot adventure for:
- Players: ${numPlayers} (${experienceLevel} experience)
- Average Level: ${averageLevel}
- Genre: ${genre}
- Theme: ${theme}
- Tone: ${tone}
- World Style: ${worldStyle}
- Scene Order: ${sceneBlocks.join(', ')}

Instructions:
- ${detailLevel === 'Summary Version'
      ? 'Keep each scene to 4–6 sentences, focusing on key narrative beats and player decisions.'
      : 'Each scene must be at least 10 full sentences with narration, obstacles, and consequences.'}
- Provide important DCs, checks, and consequences of success/failure.
- Include brief NPC descriptions if needed (no stat blocks).
- The result should be self-sufficient for running a complete one-shot.
- Format output with clear scene headers (e.g., “Scene 1: [Title]”).

Respond with the complete one-shot adventure.
`;

  // Trim prompt if too long
  if (prompt.length > MAX_PROMPT_LENGTH) {
    prompt = prompt.slice(0, MAX_PROMPT_LENGTH) + '\n[Prompt truncated due to length]';
  }

  try {
    const completion = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 1200,
    });

    const result = completion.data.choices[0].text.trim();
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to generate adventure.' });
  }
};
