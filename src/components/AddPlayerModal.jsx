function AddPlayerModal({ newPlayer, setNewPlayer, onAdd, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPlayer.name && newPlayer.email) {
      onAdd();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>➕ Add New Player</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Player Name *</label>
            <input 
              type="text" 
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
              placeholder="Enter player name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              value={newPlayer.email}
              onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
              placeholder="player@example.com"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPlayerModal;
