const OpenAI = require('openai');

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
    detailLevel = 'medium',
    includeDialogue = false,
    includeStatblocks = false,
    includePuzzles = false,
  } = req.body;

  if (!Array.isArray(structure)) {
    return res.status(400).json({ error: 'Invalid or missing "structure" array.' });
  }

  // Detail Level Map
  const detailMap = {
    low: 'Each scene should include 4–5 narrative sentences.',
    medium: 'Each scene should include 6–8 narrative sentences.',
    high: 'Each scene should include 10–12 richly descriptive narrative sentences with strong sensory and emotional detail.'
  };

  // Dynamic Sections
  const dialogueLine = includeDialogue
    ? 'Where appropriate, include short snippets of NPC dialogue to guide roleplay.'
    : '';

  const combatLine = includeStatblocks
    ? `For any combat encounters, provide a [STATBLOCK] using this format:

[STATBLOCK: Enemy Name]
- AC:
- HP:
- Attacks:
- Abilities:
- Tactics:`
    : 'Do not include combat statblocks. Assume enemies exist but leave their stats to the DM.';

  const puzzleLine = includePuzzles
    ? 'Include at least one puzzle, trap, or ritual requiring player ingenuity. Provide mechanics, success/failure outcomes, and consequences.'
    : '';

  const prompt = `
You are an expert ${ruleset} game master. Generate a fully playable one-shot for ${numberOfPlayers} ${experienceLevel.toLowerCase()} players (avg. level ${averagePlayerLevel}) in a ${worldStyle.toLowerCase()} setting with a ${tone.toLowerCase()} tone.
Genre: ${genre}.
Theme: ${theme}.
Structure the session in the following order: ${structure.join(' → ')}.

Use this format:

[HEADER: Scene Name]

${detailMap[detailLevel]}
${dialogueLine}
- Include key skill checks (with DCs), consequences for success/failure, and meaningful decisions or locations.
${puzzleLine}
${combatLine}

Use [HEADER], [BULLET], and [STATBLOCK] tags for formatting instead of markdown symbols. Do not include code blocks or markdown.

End with:

[HEADER: Conclusion]
Summarize the party's impact and aftermath.

[HEADER: DM Notes]
List any treasure, XP, NPC motivations, and optional plot hooks.

Only include structured text that can be rendered cleanly. Do not reference any external material.

Additional user notes: ${extraNotes || 'None'}.
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
