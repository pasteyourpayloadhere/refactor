import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [highlightedLines, setHighlightedLines] = useState({});
  const [highlightMode, setHighlightMode] = useState(false);

  const colors = [
    '#ffcccc', '#ccffcc', '#cce5ff', '#ffffcc', '#e5ccff',
    '#ffd9b3', '#d9f2e6', '#f2e6d9', '#cce6ff', '#ffccff',
    '#d9e6ff', '#fff0cc', '#e6d9f2', '#b3ffd9', '#f2d9e6'
  ];

  const handleCodeChange = (e) => {
    if (!highlightMode) {
      setCode(e.target.value);
    }
  };

  const applyHighlight = (color) => {
    if (!highlightMode) return;

    const textarea = document.getElementById('codeInput');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      window.alert('Please select some text to highlight.');
      return;
    }

    const lines = code.split('\n');
    let charCount = 0;
    const newHighlights = { ...highlightedLines };

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1;
      const lineStart = charCount;
      const lineEnd = charCount + lineLength;

      if (
        (start >= lineStart && start < lineEnd) ||
        (end > lineStart && end <= lineEnd) ||
        (start <= lineStart && end >= lineEnd)
      ) {
        newHighlights[i] = color;
      }
      charCount += lineLength;
    }

    setHighlightedLines(newHighlights);
  };

  const clearHighlights = () => {
    setHighlightedLines({});
  };

  const toggleHighlightMode = () => {
    setHighlightMode(!highlightMode);
  };

  // Save functionality
  const saveFile = () => {
    const data = {
      code: code,
      highlights: highlightedLines
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'highlighted_code.dat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Load functionality
  const loadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dat';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setCode(data.code || '');
          setHighlightedLines(data.highlights || {});
        } catch (error) {
          window.alert('Error loading file: Invalid format');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  const renderCode = () => {
    const lines = code.split('\n');
    return lines.map((line, index) => (
      <div
        key={index}
        style={{
          backgroundColor: highlightedLines[index] || 'transparent',
          padding: '2px 5px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          minHeight: '1.2em',
        }}
      >
        {line || '\u00A0'}
      </div>
    ));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Refactor</h1>

      {/* Mode Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={toggleHighlightMode}
          style={{
            padding: '10px 20px',
            backgroundColor: highlightMode ? '#ffdddd' : '#ddffdd',
            border: '1px solid #ccc',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          {highlightMode ? 'Pasting Disabled' : 'Pasting Enabled'}
        </button>
        <button
          onClick={clearHighlights}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Clear Highlights
        </button>
        <button
          onClick={saveFile}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e0f0ff',
            border: '1px solid #ccc',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Save
        </button>
        <button
          onClick={loadFile}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e0ffe0',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Load
        </button>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
          {highlightMode
            ? 'Select text and click a color to highlight. Switch to Off to edit.'
            : 'Paste or edit code freely. Switch to On to highlight.'}
        </p>
      </div>

      {/* Sticky Color Palette */}
      <div
        className="color-palette"
        style={{
          position: 'sticky',
          top: '20px',
          zIndex: 10,
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>Color Palette:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => applyHighlight(color)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: color,
                border: '1px solid #000',
                cursor: highlightMode ? 'pointer' : 'not-allowed',
                opacity: highlightMode ? 1 : 0.5,
              }}
              disabled={!highlightMode}
            />
          ))}
        </div>
      </div>

      {/* Single Textarea with Highlights */}
      <div>
        <h3>Code Editor:</h3>
        <div
          style={{
            position: 'relative',
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            minHeight: '400px',
            overflowY: 'auto',
          }}
        >
          <textarea
            id="codeInput"
            value={code}
            onChange={handleCodeChange}
            placeholder="Paste your code here..."
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              fontFamily: 'monospace',
              padding: '10px',
              border: 'none',
              background: 'transparent',
              resize: 'none',
              zIndex: 2,
              color: 'transparent',
              caretColor: 'black',
            }}
          />
          <pre
            style={{
              margin: 0,
              padding: 0,
              position: 'relative',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            {renderCode()}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
