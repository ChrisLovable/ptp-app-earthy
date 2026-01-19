import { useState, useEffect } from 'react';
import { database } from './database';
import CoachView from './components/CoachView';
import PlayerView from './components/PlayerView';
import PlayerEditor from './components/PlayerEditor';
import * as XLSX from 'xlsx';

function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('coach');
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [isPlayerLinkSession, setIsPlayerLinkSession] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    email: '',
    targetTitles: {
      target1: 'Skinfolds',
      target2: 'Bronco',
      target3: 'CMJ',
      target4: 'Body Weight',
      target5: 'VO2 Max',
      target6: 'Flexibility'
    },
    targets: {
      target1: '',
      target2: '',
      target3: '',
      target4: '',
      target5: '',
      target6: ''
    },
    targetVisible: {
      target1: true,
      target2: true,
      target3: true,
      target4: false,
      target5: false,
      target6: false
    },
    cardTitles: {
      card1: 'Strength',
      card2: 'Conditioning',
      card3: 'Speed',
      card4: 'Mobility',
      card5: 'Recovery',
      card6: 'Nutrition'
    },
    plan: {
      card1: '',
      card1Focus: '',
      card2: '',
      card2Focus: '',
      card3: '',
      card3Focus: '',
      card4: '',
      card4Focus: '',
      card5: '',
      card5Focus: '',
      card6: '',
      card6Focus: ''
    },
    cardVisible: {
      card1: true,
      card2: true,
      card3: true,
      card4: true,
      card5: true,
      card6: true
    }
  });

  // Load players from Firebase
  useEffect(() => {
    loadPlayers();
    checkPlayerLink();
    checkForUpdates();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    const playersData = await database.getAllPlayers();
    setPlayers(playersData);
    setLoading(false);
  };

  // Check for service worker updates
  const checkForUpdates = () => {
    if ('serviceWorker' in navigator) {
      // Listen for update available event
      window.addEventListener('sw-update-available', () => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration && registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowUpdatePrompt(true);
          }
        });
      });

      // Check immediately
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
          
          // Check if there's a waiting worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowUpdatePrompt(true);
          }

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        }
      });
    }
  };

  // Handle update installation
  const handleUpdateApp = () => {
    if (waitingWorker) {
      // Send message to service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to activate new service worker
      window.location.reload();
    }
  };

  const checkPlayerLink = () => {
    const urlParams = new URLSearchParams(window.location.search);
    // Support both old (?player=ID) and new (?token=TOKEN) formats
    const playerToken = urlParams.get('token');
    const playerId = urlParams.get('player');
    
    if (playerToken) {
      handlePlayerLinkLogin(playerToken);
    } else if (playerId) {
      // Fallback to old format if token not available (backward compatibility)
      handlePlayerLinkLoginById(playerId);
    }
  };

  // New secure token-based login
  const handlePlayerLinkLogin = async (playerToken) => {
    const player = await database.getPlayerByToken(playerToken);
    if (player) {
      await loginPlayer(player);
    }
  };

  // Fallback: old ID-based login (backward compatibility)
  const handlePlayerLinkLoginById = async (playerId) => {
    const player = await database.getPlayer(playerId);
    if (player) {
      await loginPlayer(player);
    }
  };

  // Shared login logic
  const loginPlayer = async (player) => {
    if (player) {
      // Migrate old data format
      if (player.targets && player.targets.skinfolds && !player.targets.target1) {
        player.targets.target1 = player.targets.skinfolds;
        player.targets.target2 = player.targets.bronco;
        player.targets.target3 = player.targets.cmj;
      }
      
      // Set defaults
      if (!player.targetTitles) {
        player.targetTitles = {
          target1: 'Skinfolds',
          target2: 'Bronco',
          target3: 'CMJ',
          target4: 'Body Weight',
          target5: 'VO2 Max',
          target6: 'Flexibility'
        };
      }
      
      if (!player.cardTitles) {
        player.cardTitles = {
          card1: 'Strength',
          card2: 'Conditioning',
          card3: 'Speed',
          card4: 'Mobility',
          card5: 'Recovery',
          card6: 'Nutrition'
        };
      }

      if (!player.targetVisible) {
        player.targetVisible = {
          target1: !!player.targets?.target1,
          target2: !!player.targets?.target2,
          target3: !!player.targets?.target3,
          target4: !!player.targets?.target4,
          target5: !!player.targets?.target5,
          target6: !!player.targets?.target6
        };
      } else {
        if (player.targets?.target4 && !player.targetVisible.target4) {
          player.targetVisible.target4 = true;
        }
        if (player.targets?.target5 && !player.targetVisible.target5) {
          player.targetVisible.target5 = true;
        }
        if (player.targets?.target6 && !player.targetVisible.target6) {
          player.targetVisible.target6 = true;
        }
      }

      if (!player.cardVisible) {
        player.cardVisible = {
          card1: true,
          card2: true,
          card3: true,
          card4: true,
          card5: true,
          card6: true
        };
      }

      setCurrentUser(player);
      setView('player');
      setIsPlayerLinkSession(true);
    }
  };

  const handleAddPlayer = async () => {
    try {
      const player = await database.addPlayer(newPlayer);
      await loadPlayers();
      setShowAddPlayer(false);
      setNewPlayer({
        name: '',
        email: '',
        targetTitles: {
          target1: 'Skinfolds',
          target2: 'Bronco',
          target3: 'CMJ',
          target4: 'Body Weight',
          target5: 'VO2 Max',
          target6: 'Flexibility'
        },
        targets: { target1: '', target2: '', target3: '', target4: '', target5: '', target6: '' },
        targetVisible: { target1: true, target2: true, target3: true, target4: false, target5: false, target6: false },
        cardTitles: {
          card1: 'Strength',
          card2: 'Conditioning',
          card3: 'Speed',
          card4: 'Mobility',
          card5: 'Recovery',
          card6: 'Nutrition'
        },
        plan: {
          card1: '', card1Focus: '', card2: '', card2Focus: '', card3: '', card3Focus: '',
          card4: '', card4Focus: '', card5: '', card5Focus: '', card6: '', card6Focus: ''
        },
        cardVisible: { card1: true, card2: true, card3: true, card4: true, card5: true, card6: true }
      });
      showMessage(`Added ${player.name} to your roster`);
    } catch (error) {
      console.error('Error adding player:', error);
      showMessage('Error adding player');
    }
  };

  const handleUpdatePlayer = async (updatedPlayer) => {
    try {
      await database.updatePlayer(updatedPlayer.id, updatedPlayer);
      await loadPlayers();
      setSelectedPlayer(null);
      showMessage(`Updated ${updatedPlayer.name}`);
    } catch (error) {
      console.error('Error updating player:', error);
      showMessage('Error updating player');
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await database.deletePlayer(playerId);
      await loadPlayers();
      showMessage('Player deleted');
    } catch (error) {
      console.error('Error deleting player:', error);
      showMessage('Error deleting player');
    }
  };

  const handleCopyPlayerLink = async (playerId, e) => {
    e.stopPropagation();
    try {
      const player = await database.getPlayer(playerId);
      if (!player) return;
      
      const baseUrl = window.location.origin + window.location.pathname;
      let playerLink;
      
      // Try to use secure token if available
      let shareToken = player.shareToken;
      if (!shareToken) {
        try {
          // Generate token if doesn't exist
          const updatedPlayer = await database.generateShareToken(playerId);
          shareToken = updatedPlayer?.shareToken;
        } catch (error) {
          console.warn('Could not generate token, using ID fallback:', error);
        }
      }
      
      if (shareToken) {
        // Use secure token-based link
        playerLink = `${baseUrl}?token=${shareToken}`;
      } else {
        // Fallback to ID-based link if token system not available
        playerLink = `${baseUrl}?player=${playerId}`;
      }
      
      navigator.clipboard.writeText(playerLink).then(() => {
        // Link copied to clipboard
        console.log('Link copied to clipboard:', playerLink);
      }).catch((error) => {
        console.error('Failed to copy link:', error);
      });
    } catch (error) {
      console.error('Error generating share link:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await database.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ptp-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage('Data exported successfully');
    } catch (error) {
      console.error('Error exporting:', error);
      showMessage('Error exporting data');
    }
  };

  const handleExportToExcel = async () => {
    try {
      const players = await database.getAllPlayers();
      
      // Helper function to strip HTML tags and convert to plain text
      const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
      };
      
      // Prepare comprehensive headers
      const headers = [
        'Name', 
        'Email', 
        'Last Updated',
        // Targets
        'Target 1 Name', 'Target 1 Value',
        'Target 2 Name', 'Target 2 Value',
        'Target 3 Name', 'Target 3 Value',
        'Target 4 Name', 'Target 4 Value',
        'Target 5 Name', 'Target 5 Value',
        'Target 6 Name', 'Target 6 Value',
        // Training Plan Cards
        'Card 1 Title', 'Card 1 Focus', 'Card 1 Plan',
        'Card 2 Title', 'Card 2 Focus', 'Card 2 Plan',
        'Card 3 Title', 'Card 3 Focus', 'Card 3 Plan',
        'Card 4 Title', 'Card 4 Focus', 'Card 4 Plan',
        'Card 5 Title', 'Card 5 Focus', 'Card 5 Plan',
        'Card 6 Title', 'Card 6 Focus', 'Card 6 Plan'
      ];
      
      const rows = players.map(player => [
        player.name || '',
        player.email || '',
        player.lastUpdated || '',
        // Targets
        player.targetTitles?.target1 || '',
        player.targets?.target1 || '',
        player.targetTitles?.target2 || '',
        player.targets?.target2 || '',
        player.targetTitles?.target3 || '',
        player.targets?.target3 || '',
        player.targetTitles?.target4 || '',
        player.targets?.target4 || '',
        player.targetTitles?.target5 || '',
        player.targets?.target5 || '',
        player.targetTitles?.target6 || '',
        player.targets?.target6 || '',
        // Training Plan Cards
        player.cardTitles?.card1 || '',
        player.plan?.card1Focus || '',
        stripHtml(player.plan?.card1 || ''),
        player.cardTitles?.card2 || '',
        player.plan?.card2Focus || '',
        stripHtml(player.plan?.card2 || ''),
        player.cardTitles?.card3 || '',
        player.plan?.card3Focus || '',
        stripHtml(player.plan?.card3 || ''),
        player.cardTitles?.card4 || '',
        player.plan?.card4Focus || '',
        stripHtml(player.plan?.card4 || ''),
        player.cardTitles?.card5 || '',
        player.plan?.card5Focus || '',
        stripHtml(player.plan?.card5 || ''),
        player.cardTitles?.card6 || '',
        player.plan?.card6Focus || '',
        stripHtml(player.plan?.card6 || '')
      ]);

      // Create worksheet data
      const worksheetData = [headers, ...rows];
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Last Updated
        // Target columns
        { wch: 15 }, { wch: 15 }, // Target 1 Name, Value
        { wch: 15 }, { wch: 15 }, // Target 2 Name, Value
        { wch: 15 }, { wch: 15 }, // Target 3 Name, Value
        { wch: 15 }, { wch: 15 }, // Target 4 Name, Value
        { wch: 15 }, { wch: 15 }, // Target 5 Name, Value
        { wch: 15 }, { wch: 15 }, // Target 6 Name, Value
        // Training Plan columns
        { wch: 15 }, { wch: 20 }, { wch: 50 }, // Card 1 Title, Focus, Plan
        { wch: 15 }, { wch: 20 }, { wch: 50 }, // Card 2 Title, Focus, Plan
        { wch: 15 }, { wch: 20 }, { wch: 50 }, // Card 3 Title, Focus, Plan
        { wch: 15 }, { wch: 20 }, { wch: 50 }, // Card 4 Title, Focus, Plan
        { wch: 15 }, { wch: 20 }, { wch: 50 }, // Card 5 Title, Focus, Plan
        { wch: 15 }, { wch: 20 }, { wch: 50 }  // Card 6 Title, Focus, Plan
      ];
      worksheet['!cols'] = columnWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Players');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ptp-players-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage('Exported to Excel successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      showMessage('Error exporting to Excel');
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          await database.importData(data);
          await loadPlayers();
          showMessage('Data imported successfully');
        } catch (error) {
          console.error('Error importing:', error);
          showMessage('Error importing data');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLogout = () => {
    // If logging out from a player link session (athlete view), close the app
    if (isPlayerLinkSession) {
      setCurrentUser(null);
      setIsPlayerLinkSession(false);
      // Clear URL to prevent back button access
      window.history.replaceState({}, '', window.location.pathname);
      
      // Close the app/window
      if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        // For PWA/standalone mode
        window.close();
        // Fallback: redirect to blank page if close doesn't work
        setTimeout(() => {
          window.location.href = 'about:blank';
        }, 100);
      } else {
        // For browser tabs
        window.location.href = 'about:blank';
        setTimeout(() => {
          try {
            window.close();
          } catch (e) {
            // If close fails, at least we redirected away
            console.log('Could not close window (browser security)');
          }
        }, 100);
      }
    } else {
      // Coach logout
      setCurrentUser(null);
      setView('coach');
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const showMessage = (message) => {
    setUpdateMessage(message);
    setTimeout(() => setUpdateMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (view === 'player' && currentUser) {
    return (
      <PlayerView 
        player={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Show logged out state for athletes who logged out (security: prevent access to coach view)
  if (view === 'logged-out') {
    return (
      <div className="logged-out-container">
        <div className="logged-out-message">
          <h2>Logged Out</h2>
          <p>You have been successfully logged out.</p>
        </div>
      </div>
    );
  }

  if (selectedPlayer) {
    return (
      <PlayerEditor
        player={selectedPlayer}
        onUpdate={handleUpdatePlayer}
        onCancel={() => setSelectedPlayer(null)}
        updateMessage={updateMessage}
      />
    );
  }

  // Only show CoachView if not coming from a player link session
  return (
    <>
      {showUpdatePrompt && (
        <div className="update-prompt-overlay">
          <div className="update-prompt">
            <h2>🔄 Update Available</h2>
            <p>A new version of the app is available. Please reload to get the latest features and improvements.</p>
            <div className="update-prompt-buttons">
              <button className="update-btn-primary" onClick={handleUpdateApp}>
                Reload Now
              </button>
              <button className="update-btn-secondary" onClick={() => setShowUpdatePrompt(false)}>
                Later
              </button>
            </div>
          </div>
        </div>
      )}
      <CoachView
        players={players}
        onSelectPlayer={setSelectedPlayer}
        onAddPlayer={handleAddPlayer}
        onDeletePlayer={handleDeletePlayer}
        onCopyPlayerLink={handleCopyPlayerLink}
        onExportData={handleExportData}
        onExportToExcel={handleExportToExcel}
        onImportData={handleImportData}
        onLogout={handleLogout}
        showAddPlayer={showAddPlayer}
        setShowAddPlayer={setShowAddPlayer}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
        updateMessage={updateMessage}
      />
    </>
  );
}

export default App;
