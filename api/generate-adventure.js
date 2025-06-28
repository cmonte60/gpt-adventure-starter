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
- **Tactics:**`
    : 'Do not include combat statblocks. Assume enemies exist but leave their stats to the DM.';

  const puzzleLine = includePuzzles
    ? 'Include at least one puzzle, trap, or ritual requiring player ingenuity. Provide mechanics, success/failure outcomes, and consequences.'
    : '';

  // STRONG INSTRUCTION TO FOLLOW SCENE STRUCTURE STRICTLY
  const strictSceneInstruction = `
Follow the **exact scene structure and sequence** below. Do not substitute or change scene types. Each scene must clearly be labeled and match the type listed:
${structure.map((scene, i) => `- Scene ${i + 1}: ${scene}`).join('\n')}

If a scene is marked "Combat", it must be a pure combat encounter. If a scene is "Boss Fight", it must be a climactic boss battle. No puzzles, traps, or alternative types should be substituted unless explicitly listed.`;

  // Markdown-style prompt
  const prompt = `
You are an expert ${ruleset} game master. Generate a tightly structured one-shot adventure for ${numberOfPlayers} ${experienceLevel.toLowerCase()} players, average level ${averagePlayerLevel}.

World style: ${worldStyle.toLowerCase()}
Tone: ${tone.toLowerCase()}
Genre: ${genre}
Theme: ${theme}

${strictSceneInstruction}

${detailInstructions}

${dialogueLine}
${puzzleLine}
${combatLine}

Output in **professional markdown**, styled for PDF or web rendering.

Begin with:

## Prologue

End with:

## Conclusion  
Summarize the party's impact and aftermath.

## DM Notes  
List any treasure, XP, NPC motivations, and optional plot hooks.

Additional user notes: ${extraNotes || 'None'}.
`;

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
