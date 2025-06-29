console.log('generateAdventure() called'); // Confirm it's invoked

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

  // Detail Level Instructions
  let detailInstructions = '';
  switch (detailLevel.toLowerCase()) {
    case 'low':
      detailInstructions = 'Each scene should include 4–5 narrative sentences.';
      break;
    case 'medium':
      detailInstructions = 'Each scene should include 6–8 narrative sentences, with suggested DCs, outcomes, and key NPCs or environmental elements.';
      break;
    case 'high':
      detailInstructions = 'Each scene must include 12–15 richly written narrative sentences, with vivid settings, character choices, dynamic outcomes, and optional mechanics or stat blocks.';
      break;
    default:
      detailInstructions = 'Each scene should include 6–8 narrative sentences.';
  }

  const dialogueLine = includeDialogue
    ? 'Include short NPC dialogue snippets to guide player interaction.'
    : '';

  const combatLine = includeStatblocks
    ? `For each combat encounter, provide a stat block in this format:

**Enemy Name**
- **AC:** 
- **HP:** 
- **Attacks:** 
- **Abilities:** 
- **Tactics:**`
    : 'Combatants should be described narratively; do not include stat blocks.';

  const puzzleLine = includePuzzles
    ? 'Include at least one puzzle, trap, or ritual. Detail mechanics, skill checks, and success/failure outcomes.'
    : '';

  const strictSceneInstruction = `
Follow the exact sequence and types below. Do not change or merge scene types. Each scene must begin with a second-level markdown header labeled with the type and scene number.

Example format:
## Scene 1: Puzzle — [Scene Title]

Scene list:
${structure.map((scene, i) => `- Scene ${i + 1}: ${scene}`).join('\n')}

Important:
- A "Combat" scene must involve tactical or violent conflict.
- A "Puzzle" scene must involve problem-solving.
- A "Social Encounter" must revolve around negotiation, influence, or conversation.
- A "Boss Fight" must be a climactic, high-stakes battle.
- Do not substitute or reinterpret scene types.`.trim();

  const prompt = `
You are a professional ${ruleset} Dungeon Master. Write a tightly structured **one-shot adventure** for ${numberOfPlayers} ${experienceLevel.toLowerCase()} players at level ${averagePlayerLevel}.

**Genre:** ${genre}  
**Theme:** ${theme}  
**World Style:** ${worldStyle}  
**Tone:** ${tone}

${strictSceneInstruction}

${detailInstructions}

${dialogueLine}  
${puzzleLine}  
${combatLine}

Output must be in professional **Markdown** format for PDF/web.

### Structure:
- Begin with:  
## Prologue  
Introduce the setting, mission hook, and tone.
- For each scene:  
## Scene X: [Scene Type] — [Scene Title]  
Follow with structured content.
- End with:  
## Conclusion  
Summarize outcomes and world reaction.
- Finish with:  
## DM Notes  
Include treasure, XP, motivations, secrets, and optional hooks.

Additional User Notes:  
${extraNotes || 'None'}
  `.trim();

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
