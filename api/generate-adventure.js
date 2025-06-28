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

  // Generate dynamic scene scaffold to enforce correct headings
  const sceneMarkdown = structure
    .map(
      (sceneType, i) =>
        `## Scene ${i + 1}: ${sceneType} — [Scene Title]\n[Replace this section with a **${sceneType.toLowerCase()}**-focused scene. Do not change the type or format.]\n`
    )
    .join('\n');

  const prompt = `
You are a professional ${ruleset} Dungeon Master. Write a tightly structured **one-shot adventure** for ${numberOfPlayers} ${experienceLevel.toLowerCase()} players at level ${averagePlayerLevel}.

**Genre:** ${genre}  
**Theme:** ${theme}  
**World Style:** ${worldStyle}  
**Tone:** ${tone}

Follow the **exact scene types and order** below. Each scene **must begin** with a second-level markdown header using the exact format provided. Do not substitute, reinterpret, or merge scene types.

---

## Prologue  
Introduce the setting, mission hook, and tone.

${sceneMarkdown}

## Conclusion  
Summarize outcomes and world reaction.

## DM Notes  
Include treasure, XP, motivations, secrets, and optional hooks.

---

${detailInstructions}  
${dialogueLine}  
${puzzleLine}  
${combatLine}

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
