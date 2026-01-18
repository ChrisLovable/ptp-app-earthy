import { useState, useEffect } from 'react';
import AddPlayerModal from './AddPlayerModal';

function CoachView({
  players,
  onSelectPlayer,
  onAddPlayer,
  onDeletePlayer,
  onCopyPlayerLink,
  onExportToExcel,
  showAddPlayer,
  setShowAddPlayer,
  newPlayer,
  setNewPlayer,
  updateMessage
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [copiedPlayerId, setCopiedPlayerId] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const filteredPlayers = players.filter(player => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      player.name.toLowerCase().includes(query) ||
      player.email.toLowerCase().includes(query)
    );
  });

  const handleDeleteClick = (player, e) => {
    e.stopPropagation();
    setPlayerToDelete(player);
  };

  const confirmDelete = () => {
    if (playerToDelete) {
      onDeletePlayer(playerToDelete.id);
      setPlayerToDelete(null);
    }
  };

  const handleCopyClick = (playerId, e) => {
    e.stopPropagation();
    onCopyPlayerLink(playerId, e);
    setCopiedPlayerId(playerId);
    setTimeout(() => setCopiedPlayerId(null), 2000);
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const isUpdatedToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
    
    if (!isInstalled) {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallButton(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted install');
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="app-container">
      {updateMessage && (
        <div className="update-message">
          ✓ {updateMessage}
        </div>
      )}

      <div className="coach-container">
        <div className="coach-header">
          <div className="coach-header-content">
            <div>
              <h1>ADRIAN LE ROUX</h1>
              <p className="subtitle">Strength & Conditioning Coach</p>
              <p className="subtitle">Player Training Plan</p>
            </div>
            <div className="data-management">
              {showInstallButton && (
                <button className="btn-small" onClick={handleInstall}>
                  📱 Install App
                </button>
              )}
              <button className="btn-small" onClick={onExportToExcel}>
                📊 Export to Excel
              </button>
            </div>
          </div>
        </div>

        <div className="coach-nav">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search players by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="search-results-count">
                Found {filteredPlayers.length} of {players.length} player{filteredPlayers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button className="nav-btn active">
            📋 Show all Players
          </button>
          <button className="add-player-btn" onClick={() => setShowAddPlayer(true)}>
            ➕ Add New Player
          </button>
          <button className="nav-btn dashboard-btn">
            🏠 Dashboard
          </button>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? (
              <>
                <p>🔍 No players found matching "{searchQuery}"</p>
                <button className="btn-small" onClick={() => setSearchQuery('')}>
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p>👥 No players yet. Add your first player to get started!</p>
                <button className="add-player-btn" onClick={() => setShowAddPlayer(true)}>
                  ➕ Add New Player
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="players-grid">
            {filteredPlayers.map(player => (
              <div 
                key={player.id} 
                className="player-card"
                onClick={() => onSelectPlayer(player)}
              >
                <h3>{player.name}</h3>
                <p>{player.email}</p>
                <div className={`player-last-updated ${isUpdatedToday(player.lastUpdated) ? 'recent' : ''}`}>
                  📅 {formatFullDate(player.lastUpdated)} ({getDaysAgo(player.lastUpdated)})
                </div>
                <button 
                  className={`copy-link-btn ${copiedPlayerId === player.id ? 'copied' : ''}`}
                  onClick={(e) => handleCopyClick(player.id, e)}
                >
                  {copiedPlayerId === player.id ? (
                    <>✓ Shared!</>
                  ) : (
                    <>📱 Share via WhatsApp</>
                  )}
                </button>
                <button 
                  className="delete-player-btn"
                  onClick={(e) => handleDeleteClick(player, e)}
                >
                  🗑️ Delete Player
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddPlayer && (
        <AddPlayerModal
          newPlayer={newPlayer}
          setNewPlayer={setNewPlayer}
          onAdd={onAddPlayer}
          onCancel={() => setShowAddPlayer(false)}
        />
      )}

      {playerToDelete && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{playerToDelete.name}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="delete-confirm-buttons">
              <button className="cancel-btn" onClick={() => setPlayerToDelete(null)}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachView;
