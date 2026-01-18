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
  const [showAddPlayer, setShowAddPlayer] = useState(false);
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
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    const playersData = await database.getAllPlayers();
    setPlayers(playersData);
    setLoading(false);
  };

  const checkPlayerLink = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('player');
    if (playerId) {
      handlePlayerLinkLogin(playerId);
    }
  };

  const handlePlayerLinkLogin = async (playerId) => {
    const player = await database.getPlayer(playerId);
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

  const handleCopyPlayerLink = (playerId, e) => {
    e.stopPropagation();
    const baseUrl = window.location.origin + window.location.pathname;
    const playerLink = `${baseUrl}?player=${playerId}`;
    
    navigator.clipboard.writeText(playerLink).then(() => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(playerLink)}`;
      window.open(whatsappUrl, '_blank');
    });
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
    setCurrentUser(null);
    setView('coach');
    window.history.pushState({}, '', window.location.pathname);
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

  return (
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
  );
}

export default App;
