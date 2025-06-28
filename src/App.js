import React, { useState } from 'react';
import './App.css';
import AdventureStructure from './AdventureStructure';
import { marked } from 'marked';

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
  const [numPlayers, setNumPlayers] = useState('4');
  const [averageLevel, setAverageLevel] = useState('5');
  const [detailLevel, setDetailLevel] = useState('medium');
  const [includeDialogue, setIncludeDialogue] = useState(false);
  const [includeStatblocks, setIncludeStatblocks] = useState(false);
  const [includePuzzles, setIncludePuzzles] = useState(false);
  const pdfStyles = `
    * {
      color: #000 !important;
      background: #fff !important;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #1f2937 !important;
    }
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
    }
    code, pre {
      background: #f3f4f6 !important;
      color: #111827 !important;
      padding: 0.5em;
      border-radius: 6px;
    }
  `;

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

    const payload = {
      ruleset,
      numberOfPlayers: numPlayers,
      experienceLevel,
      averagePlayerLevel: averageLevel,
      genre,
      theme,
      tone,
      worldStyle,
      structure: sceneBlocks,
      extraNotes,
      detailLevel,
      includeDialogue,
      includeStatblocks,
      includePuzzles,
    };

    try {
      const response = await fetch('/api/generate-adventure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        <button onClick={() => setActiveTab('one-shot')} className={activeTab === 'one-shot' ? 'active' : ''}>
          One-Shot
        </button>
        <button onClick={() => setActiveTab('campaign')} className={activeTab === 'campaign' ? 'active' : ''}>
          Campaign (Premium)
        </button>
      </div>

      {activeTab === 'one-shot' && (
        <>
          {/* Party Info Section */}
          <section className="builder-section">
            <h2>Party Info</h2>
            <div className="grid">
              {/* ...player configuration dropdowns... */}
              <div>
                <label># of Players</label>
                <select value={numPlayers} onChange={(e) => setNumPlayers(e.target.value)}>
                  {[...Array(10).keys()].map(i => <option key={i + 1}>{i + 1}</option>)}
                </select>
              </div>
              <div>
                <label>Average Player Level</label>
                <select value={averageLevel} onChange={(e) => setAverageLevel(e.target.value)}>
                  {[...Array(20).keys()].map(i => <option key={i + 1}>{i + 1}</option>)}
                </select>
              </div>
              <div>
                <label>Player Experience Level</label>
                <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                  {['Novice', 'Intermediate', 'Expert'].map(level => <option key={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label>Ruleset</label>
                <select value={ruleset} onChange={(e) => setRuleset(e.target.value)}>
                  {['5e', 'D&D One', 'Pathfinder', 'Custom'].map(rule => <option key={rule}>{rule}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Setting & Theme Section */}
          <section className="builder-section">
            <h2>Setting & Theme</h2>
            <div className="grid">
              {/* ...setting config dropdowns... */}
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

          {/* AI Options Section */}
          <section className="builder-section">
            <h2>AI Customization Options</h2>
            <div className="grid">
              <div>
                <label>Detail Level</label>
                <select value={detailLevel} onChange={e => setDetailLevel(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={includeDialogue} onChange={e => setIncludeDialogue(e.target.checked)} />
                  Include NPC Dialogue
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={includeStatblocks} onChange={e => setIncludeStatblocks(e.target.checked)} />
                  Include Combat Statblocks
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={includePuzzles} onChange={e => setIncludePuzzles(e.target.checked)} />
                  Include Puzzle Mechanics
                </label>
              </div>
            </div>
          </section>

          <section className="builder-section">
            <AdventureStructure
              sceneBlocks={sceneBlocks}
              setSceneBlocks={setSceneBlocks}
              availableScenes={availableScenes}
              addSceneBlock={addSceneBlock}
            />
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
        </>
      )}

      {/* Adventure Display Block */}
      {generatedAdventure && (
        <div style={{ marginTop: '2rem', backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', whiteSpace: 'pre-wrap', color: '#fff' }}>
          <h2>Your Generated Adventure</h2>
          <div
            className="adventure-content"
            dangerouslySetInnerHTML={{ __html: marked.parse(generatedAdventure) }}
          />
          <button
            onClick={() => {
              const element = document.querySelector('.adventure-content');

              // Clone the element to avoid modifying what's visible
              const clone = element.cloneNode(true);

              // Inject dark text styling into the cloned content
              const style = document.createElement('style');
              style.innerHTML = pdfStyles;
              clone.appendChild(style);

                import('html2pdf.js').then(({ default: html2pdf }) => {
                  html2pdf().from(clone).set({
                    margin:       0.5,
                    filename:     'adventure.pdf',
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
                  }).save();
                });
              }}
            style={{
                marginTop: '1rem',
                padding: '0.6rem 1.2rem',
                fontSize: '1rem',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
            Download as PDF
          </button>

        </div>
      )}

      {/* Campaign Tab Placeholder */}
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
