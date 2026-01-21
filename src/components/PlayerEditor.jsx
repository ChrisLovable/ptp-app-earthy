import { useState } from 'react';

function PlayerEditor({ player, onUpdate, onCancel, updateMessage }) {
  const [editedPlayer, setEditedPlayer] = useState(player);

  const handleAutoResize = (event) => {
    const el = event.target;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSave = () => {
    onUpdate(editedPlayer);
  };

  return (
    <div className="editor-container">
      {updateMessage && (
        <div className="update-message">✓ {updateMessage}</div>
      )}
      
      <div className="editor-header">
        <h2>{editedPlayer.name}</h2>
        <div className="editor-actions">
          <button className="btn-primary" onClick={handleSave}>💾 Save Changes</button>
          <button className="btn-secondary" onClick={onCancel}>✕ Back without saving</button>
        </div>
      </div>

      <div className="editor-sections">
        {/* Basic Info */}
        <div className="editor-section">
          <h3>Player Information</h3>
          <label>Name:</label>
          <input 
            type="text" 
            value={editedPlayer.name}
            onChange={(e) => setEditedPlayer({...editedPlayer, name: e.target.value})}
          />
          <label>Email:</label>
          <input 
            type="email" 
            value={editedPlayer.email}
            onChange={(e) => setEditedPlayer({...editedPlayer, email: e.target.value})}
          />
        </div>

        {/* Fitness Targets */}
        <div className="editor-section">
          <h3>Fitness Targets</h3>
          {[1,2,3,4,5,6].map(num => (
            <div key={num} className="target-editor">
              <div className="checkbox-group">
                <input 
                  type="checkbox"
                  id={`target${num}-visible`}
                  checked={editedPlayer.targetVisible?.[`target${num}`] !== false}
                  onChange={(e) => setEditedPlayer({
                    ...editedPlayer,
                    targetVisible: {...editedPlayer.targetVisible, [`target${num}`]: e.target.checked}
                  })}
                />
                <label htmlFor={`target${num}-visible`}>Show to athlete</label>
              </div>
              <label>Target {num} Name:</label>
              <input 
                type="text" 
                value={editedPlayer.targetTitles?.[`target${num}`] || ''}
                onChange={(e) => setEditedPlayer({
                  ...editedPlayer,
                  targetTitles: {...editedPlayer.targetTitles, [`target${num}`]: e.target.value}
                })}
                placeholder={`e.g. ${['Skinfolds','Bronco','CMJ','Body Weight','VO2 Max','Flexibility'][num-1]}`}
              />
              <input 
                type="text" 
                value={editedPlayer.targets?.[`target${num}`] || ''}
                onChange={(e) => setEditedPlayer({
                  ...editedPlayer,
                  targets: {...editedPlayer.targets, [`target${num}`]: e.target.value}
                })}
                placeholder="Enter target value"
              />
            </div>
          ))}
        </div>

        {/* Training Cards */}
        {[1,2,3,4,5,6].map(num => (
          <div key={num} className="editor-section">
            <div className="card-header-row">
              <h3>{editedPlayer.cardTitles?.[`card${num}`] || `Card ${num}`}</h3>
              <div className="checkbox-group">
                <input 
                  type="checkbox"
                  id={`card${num}-visible`}
                  checked={editedPlayer.cardVisible?.[`card${num}`] !== false}
                  onChange={(e) => setEditedPlayer({
                    ...editedPlayer,
                    cardVisible: {...editedPlayer.cardVisible, [`card${num}`]: e.target.checked}
                  })}
                />
                <label htmlFor={`card${num}-visible`}>Show to athlete</label>
              </div>
            </div>
            <label>Card Title:</label>
            <input 
              type="text" 
              value={editedPlayer.cardTitles?.[`card${num}`] || ''}
              onChange={(e) => setEditedPlayer({
                ...editedPlayer,
                cardTitles: {...editedPlayer.cardTitles, [`card${num}`]: e.target.value}
              })}
            />
            <label>Key Focus:</label>
            <textarea
              className="auto-expand"
              value={editedPlayer.plan?.[`card${num}Focus`] || ''}
              onChange={(e) => setEditedPlayer({
                ...editedPlayer,
                plan: {...editedPlayer.plan, [`card${num}Focus`]: e.target.value}
              })}
              onInput={handleAutoResize}
              placeholder="e.g. Focus on time under tension"
            />
            <label>Training Plan:</label>
            <div
              className="rich-text-editor"
              contentEditable={true}
              dangerouslySetInnerHTML={{ __html: editedPlayer.plan?.[`card${num}`] || '' }}
              onBlur={(e) => setEditedPlayer({
                ...editedPlayer,
                plan: {...editedPlayer.plan, [`card${num}`]: e.target.innerHTML}
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerEditor;
