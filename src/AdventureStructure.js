import React, { useState } from 'react';

const SCENE_BLOCKS = [
  'Puzzle',
  'Combat',
  'Investigation',
  'Social Interaction',
  'Exploration',
  'Mystery',
  'Trap',
  'Boss Fight',
];

export default function AdventureStructure({ timeline, setTimeline }) {
  const [timeline, setTimeline] = useState([]);

  // Add a block if under limit (let's say free users max 4 blocks here, adjust as needed)
  function addBlock(block) {
    if (timeline.length >= 15) return; // Change limit as needed
    setTimeline([...timeline, block]);
  }

  // Remove block by index
  function removeBlock(index) {
    setTimeline(timeline.filter((_, i) => i !== index));
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ color: '#eee', marginBottom: '1rem' }}>Build Your Adventure Structure</h2>

      {/* Buttons to add scene blocks */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          userSelect: 'none',
        }}
      >
        {SCENE_BLOCKS.map((block) => (
          <button
            key={block}
            onClick={() => addBlock(block)}
            style={{
              backgroundColor: '#2a3e63',
              border: 'none',
              borderRadius: '20px',
              color: '#ccc',
              fontWeight: '600',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#40609f')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2a3e63')}
          >
            {block}
          </button>
        ))}
      </div>

      {/* Timeline container */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '1rem',
          padding: '0.5rem',
          backgroundColor: '#15263c',
          borderRadius: '12px',
          minHeight: '70px',
          alignItems: 'center',
          boxShadow: '0 0 8px rgba(0,0,0,0.5)',
        }}
      >
        {timeline.length === 0 && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            No scene blocks added yet. Click a block above to add.
          </div>
        )}

        {timeline.map((block, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#3b4f77',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '16px',
              position: 'relative',
              minWidth: '120px',
              textAlign: 'center',
              userSelect: 'none',
              boxShadow: '0 0 6px rgba(0,0,0,0.4)',
              flexShrink: 0,
            }}
          >
            {block}
            {/* Remove button */}
            <button
              onClick={() => removeBlock(index)}
              aria-label={`Remove ${block}`}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#d9534f',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                lineHeight: '20px',
                fontSize: '16px',
                boxShadow: '0 0 6px rgba(0,0,0,0.6)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c9302c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#d9534f')}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
