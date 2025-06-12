import React, { useState } from 'react';
import './App.css';
import AdventureStructure from './AdventureStructure';

function App() {
  const [activeTab, setActiveTab] = useState('one-shot');
  const [sceneBlocks, setSceneBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedAdventure, setGeneratedAdventure] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [genre, setGenre] = useState('High Fantasy');
  const [tone, setTone] = useState('Lighthearted');
  const [worldStyle, setWorldStyle] = useState('Magic-Rich');
  const [ruleset, setRuleset] = useState('5e');
  const [experienceLevel, setExperienceLevel] = useState('Novice');
  const [theme, setTheme] = useState('Undead Invasion');

  const maxBlocks = 4;
  const availableScenes = ['Combat', 'Puzzle', 'Social Encounter', 'Exploration', 'Investigation', 'Boss Fight'];

  const addSceneBlock = (scene) => {
    if (sceneBlocks.length < maxBlocks) {
      setSceneBlocks([...sceneBlocks, scene]);
    }
  };

  const generateAdventure = async () => {
    setLoading(true);
    setGeneratedAdventure('');

    const prompt = `
Generate a D&D-style adventure with the following settings:

- Genre: ${genre}
- Tone: ${tone}
- World Style: ${worldStyle}
- Ruleset: ${ruleset}
- Experience Level: ${experienceLevel}
- Adventure Type: ${activeTab === 'campaign' ? 'Campaign' : 'One-Shot'}
- Theme: ${theme}
- Structure: ${sceneBlocks.join(' → ')}
- Additional Notes: ${extraNotes || 'None'}

Respond with an adventure structured according to the above.
`;

    try {
      const response = await fetch('/api/generate-adventure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedAdventure(data.result);
      } else {
        setGeneratedAdventure(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setGeneratedAdventure('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('one-shot')} className={activeTab === 'one-shot' ? 'active' : ''}>One-Shot</button>
        <button onClick={() => setActiveTab('campaign')} className={activeTab === 'campaign' ? 'active' : ''}>Campaign (Premium)</button>
      </div>

      {activeTab === 'one-shot' && (
        <>
          <section className="builder-section">
  <h2>Party Info</h2>
  <div className="grid">
    <div>
      <label># of Players</label>
      <select>
        {[...Array(10).keys()].map(i => <option key={i+1}>{i+1}</option>)}
      </select>
    </div>
    <div>
      <label>Average Player Level</label>
      <select>
        {[...Array(20).keys()].map(i => <option key={i+1}>{i+1}</option>)}
      </select>
    </div>
    <div>
      <label>Player Experience Level</label>
      <select>
        {['Novice', 'Intermediate', 'Expert'].map(level => <option key={level}>{level}</option>)}
      </select>
    </div>
    <div>
      <label>Ruleset</label>
      <select>
        {['5e', 'D&D One', 'Pathfinder', 'Custom'].map(rule => <option key={rule}>{rule}</option>)}
      </select>
    </div>
  </div>
</section>


          <section className="builder-section">
            <h2>Setting & Theme</h2>
            <div className="grid">
              <div>
                <label>Genre</label>
                <select value={genre} onChange={e => setGenre(e.target.value)}>
                  {['High Fantasy', 'Dark Fantasy', 'Post-Apocalyptic', 'Steampunk', 'Science Fiction', 'Historical Fiction', 'Urban Fantasy', 'Dystopian', 'Cyberpunk', 'Superhero', 'Espionage', 'Romance', 'Mystery', 'Horror', 'Alternate History', 'No Preference'].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label>World Style</label>
                <select value={worldStyle} onChange={e => setWorldStyle(e.target.value)}>
                  {['Magic-Rich', 'Low Magic', 'Technological', 'Mythological', 'Tribal/Primal', 'Feudal Japan', 'Victorian', 'Utopian', 'Underground Cities', 'Oceanic Civilization', 'Sky Islands', 'Biopunk', 'Dieselpunk', 'Shattered Realms', 'No Preference'].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label>Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)}>
                  {['Lighthearted', 'Grim', 'Epic', 'Mystery', 'Hopeful', 'Melancholic', 'Gritty Realism', 'Playful', 'Heroic', 'Brooding', 'Anxious', 'Satirical', 'Bittersweet', 'Brutalist', 'No Preference'].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label>Theme</label>
                <select value={theme} onChange={e => setTheme(e.target.value)}>
                  {['Undead Invasion', 'Political Drama', 'Treasure Hunt', 'Survival', 'Redemption', 'Rebellion', 'Legacy', 'Forbidden Knowledge', 'AI Ascendancy', 'Secrets', 'Found Family', 'Power & Corruption', 'Social Collapse', 'Rise & Fall', 'Identity', 'No Preference'].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="builder-section">
            <AdventureStructure sceneBlocks={sceneBlocks} setSceneBlocks={setSceneBlocks} availableScenes={availableScenes} addSceneBlock={addSceneBlock} />
          </section>

          <section className="builder-section">
            <h2>Extra Notes</h2>
            <textarea
              rows="4"
              placeholder="Anything else to include in the adventure..."
              value={extraNotes}
              onChange={e => setExtraNotes(e.target.value)}
            />
          </section>

          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={generateAdventure} 
              disabled={loading}
              style={{
                padding: '0.8rem 1.6rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: '#fff',
                cursor: 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Generating...' : 'Generate Adventure'}
            </button>
          </div>

          {generatedAdventure && (
            <div style={{ marginTop: '2rem', backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', whiteSpace: 'pre-wrap', color: '#fff' }}>
              <h2>Your Generated Adventure</h2>
              <p>{generatedAdventure}</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'campaign' && (
        <section className="builder-section">
          <h2>Campaign Builder (Coming Soon for Premium Users)</h2>
          <p>This feature will allow for chained narratives across multiple sessions with dynamic evolution of character arcs, plotlines, and world events.</p>
        </section>
      )}
    </div>
  );
}

export default App;
