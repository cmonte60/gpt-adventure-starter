const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const {
    genre,
    tone,
    worldStyle,
    ruleset,
    experienceLevel,
    theme,
    structure,
    extraNotes,
    numberOfPlayers,
    averagePlayerLevel,
  } = req.body;

  const prompt = `
You are an expert ${ruleset} game master. Please generate a full one-shot session for a party of ${numberOfPlayers} ${experienceLevel.toLowerCase()} players, with an average character level of ${averagePlayerLevel}.
The setting is a ${worldStyle.toLowerCase()} world, with a ${tone.toLowerCase()} tone. The overarching genre is ${genre}, and the theme is ${theme}.
Structure the session in the following order: ${structure.join(' → ')}.

Each scene must contain at least 10 full narrative sentences (excluding stat blocks), and should include any required DCs, skill checks, consequences for success/failure, and key NPCs or locations where appropriate. 
Only include necessary stat information. The one-shot should be fully self-contained and usable without referencing external materials.

Additional user notes (if any): ${extraNotes || 'None'}.

Generate in a clean, formatted markdown-like output ready for rendering or export as a document.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const result = response.choices[0].message.content.trim();
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate adventure.' });
  }
};
