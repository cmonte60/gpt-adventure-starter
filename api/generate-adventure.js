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

  // Detail Instructions Based on Detail Level
  let detailInstructions = '';
  switch (detailLevel.toLowerCase()) {
    case 'low':
      detailInstructions = 'Each scene should include 4–5 narrative sentences.';
      break;
    case 'medium':
      detailInstructions = 'Each scene should include 6–8 narrative sentences, with suggested DCs, outcomes, and key NPCs or environmental elements.';
      break;
    case 'high':
      detailInstructions = 'Each scene must include at least **12–15** richly written narrative sentences, including detailed setting descriptions, named NPCs with motivations, optional character choices, dynamic skill check outcomes, and relevant stat blocks or puzzles.';
      break;
    default:
      detailInstructions = 'Each scene should include 6–8 narrative sentences.';
  }

  // Feature Options
  const dialogueLine = includeDialogue
    ? 'Where appropriate, include short snippets of NPC dialogue to guide roleplay.'
    : '';

  const combatLine = includeStatblocks
    ? `For any combat encounters, provide a stat block using this format:

**Enemy Name**
- **AC:** 
- **HP:** 
- **Attacks:** 
- **Abilities:** 
- **Tactics:** `
    : 'Do not include combat statblocks. Assume enemies exist but leave their stats to the DM.';

  const puzzleLine = includePuzzles
    ? 'Include at least one puzzle, trap, or ritual requiring player ingenuity. Provide mechanics, success/failure outcomes, and consequences.'
    : '';

  // Markdown-style prompt
  const prompt = `
You are an expert ${ruleset} game master. Please generate a full one-shot session for a party of ${numberOfPlayers} ${experienceLevel.toLowerCase()} players, with an average character level of ${averagePlayerLevel}.
The setting is a ${worldStyle.toLowerCase()} world, with a ${tone.toLowerCase()} tone. The overarching genre is ${genre}, and the theme is ${theme}.
Structure the session in the following order: ${structure.join(' → ')}.

${detailInstructions}

${dialogueLine}
${puzzleLine}
${combatLine}

Generate in **clean, human-readable markdown**, using headers (##), bold, bullet points, and spacing as needed. Output must be styled for rendering as a professional PDF or web page.

Begin with:

## Prologue

End with:

## Conclusion  
Summarize the party's impact and aftermath.

## DM Notes  
List any treasure, XP, NPC motivations, and optional plot hooks.

Additional user notes: ${extraNotes || 'None'}.
`;

  // Use gpt-4o for high detail, otherwise gpt-3.5-turbo
  const model = detailLevel.toLowerCase() === 'high' ? 'gpt-4o' : 'gpt-3.5-turbo';
  const maxTokens = detailLevel.toLowerCase() === 'high' ? 8000 : 3000;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const result = response.choices[0].message.content.trim();
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate adventure.' });
  }
};
