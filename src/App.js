import React, { useState } from 'react';
import './App.css';
import AdventureStructure from './AdventureStructure';


function App() {
  const [activeTab, setActiveTab] = useState('one-shot');
  const [sceneBlocks, setSceneBlocks] = useState([]);
  const maxBlocks = 4; // Default for free users
  const availableScenes = ['Combat', 'Puzzle', 'Social Encounter', 'Exploration', 'Investigation', 'Boss Fight'];

  const addSceneBlock = (scene) => {
    if (sceneBlocks.length < maxBlocks) {
      setSceneBlocks([...sceneBlocks, scene]);
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
      <select>
        {[
          'High Fantasy',
          'Dark Fantasy',
          'Post-Apocalyptic',
          'Steampunk',
          'Science Fiction',
          'Historical Fiction',
          'Urban Fantasy',
          'Dystopian',
          'Cyberpunk',
          'Superhero',
          'Espionage',
          'Romance',
          'Mystery',
          'Horror',
          'Alternate History',
          'No Preference'
        ].map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
    <div>
      <label>World Style</label>
      <select>
        {[
          'Magic-Rich',
          'Low Magic',
          'Technological',
          'Mythological',
          'Tribal/Primal',
          'Feudal Japan',
          'Victorian',
          'Utopian',
          'Underground Cities',
          'Oceanic Civilization',
          'Sky Islands',
          'Biopunk',
          'Dieselpunk',
          'Shattered Realms',
          'No Preference'
        ].map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
    <div>
      <label>Tone</label>
      <select>
        {[
          'Lighthearted',
          'Grim',
          'Epic',
          'Mystery',
          'Hopeful',
          'Melancholic',
          'Gritty Realism',
          'Playful',
          'Heroic',
          'Brooding',
          'Anxious',
          'Satirical',
          'Bittersweet',
          'Brutalist',
          'No Preference'
        ].map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
    <div>
      <label>Theme</label>
      <select>
        {[
          'Undead Invasion',
          'Political Drama',
          'Treasure Hunt',
          'Survival',
          'Redemption',
          'Rebellion',
          'Legacy',
          'Forbidden Knowledge',
          'AI Ascendancy',
          'Secrets',
          'Found Family',
          'Power & Corruption',
          'Social Collapse',
          'Rise & Fall',
          'Identity',
          'No Preference'
        ].map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
</section>


          <section className="builder-section">
  <AdventureStructure />
</section>


          <section className="builder-section">
            <h2>Extra Notes</h2>
            <textarea rows="4" placeholder="Anything else to include in the adventure..." />
          </section>
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
