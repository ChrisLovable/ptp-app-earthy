import { useState, useEffect } from 'react';

function PlayerView({ player, onLogout }) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const parseFormatting = (text) => {
    if (!text) return '';
    return text;
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

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
    const promptDismissed = localStorage.getItem('ptp-install-dismissed');
    
    if (!isInstalled && !promptDismissed) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS && isSafari) {
        setShowInstallPrompt(true);
      }
      
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      });
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted install');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      setShowInstallPrompt(false);
    }
  };

  const dismissInstall = () => {
    localStorage.setItem('ptp-install-dismissed', 'true');
    setShowInstallPrompt(false);
  };

  return (
    <div className="player-container">
      {showInstallPrompt && (
        <div className="install-prompt">
          <div className="install-prompt-content">
            <h3>📱 Install PTP App</h3>
            <p>Install Player Training Plan on your device for quick access and offline use.</p>
            <div className="install-prompt-buttons">
              <button className="install-btn" onClick={handleInstall}>
                Install Now
              </button>
              <button className="dismiss-btn" onClick={dismissInstall}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="player-header">
        <h1>{player.name}</h1>
        <p className="player-last-updated">
          {formatFullDate(player.lastUpdated)} ({getDaysAgo(player.lastUpdated)})
        </p>
        <button className="logout-btn" onClick={onLogout}>
          Close App
        </button>
      </div>

      <div className="fitness-targets">
        <h3>Fitness Targets</h3>
        <div className="targets-grid">
          {player.targetVisible?.target1 && (
            <div className="target-item">
              <div className="target-label">{player.targetTitles?.target1 || 'Target 1'}</div>
              <div className="target-value">{player.targets?.target1 || 'N/A'}</div>
            </div>
          )}
          {player.targetVisible?.target2 && (
            <div className="target-item">
              <div className="target-label">{player.targetTitles?.target2 || 'Target 2'}</div>
              <div className="target-value">{player.targets?.target2 || 'N/A'}</div>
            </div>
          )}
          {player.targetVisible?.target3 && (
            <div className="target-item">
              <div className="target-label">{player.targetTitles?.target3 || 'Target 3'}</div>
              <div className="target-value">{player.targets?.target3 || 'N/A'}</div>
            </div>
          )}
          {player.targetVisible?.target4 && (
            <div className="target-item">
              <div className="target-label">{player.targetTitles?.target4 || 'Target 4'}</div>
              <div className="target-value">{player.targets?.target4 || 'N/A'}</div>
            </div>
          )}
          {player.targetVisible?.target5 && (
            <div className="target-item">
              <div className="target-label">{player.targetTitles?.target5 || 'Target 5'}</div>
              <div className="target-value">{player.targets?.target5 || 'N/A'}</div>
            </div>
          )}
          {player.targetVisible?.target6 && (
            <div className="target-item">
              <div className="target-label">{player.targetTitles?.target6 || 'Target 6'}</div>
              <div className="target-value">{player.targets?.target6 || 'N/A'}</div>
            </div>
          )}
        </div>
      </div>

      <div className="plan-sections">
        {player.plan.card1 && player.cardVisible?.card1 !== false && (
          <div className="plan-section">
            <div className="section-header">
              <div className="section-icon strength">💪</div>
              <h3 className="section-title">{player.cardTitles?.card1 || 'Strength'}</h3>
            </div>
            {player.plan.card1Focus && (
              <div className="section-focus">
                <strong>Key Focus:</strong> {player.plan.card1Focus}
              </div>
            )}
            <div className="section-content" dangerouslySetInnerHTML={{ __html: parseFormatting(player.plan.card1) }} />
          </div>
        )}

        {player.plan.card2 && player.cardVisible?.card2 !== false && (
          <div className="plan-section">
            <div className="section-header">
              <div className="section-icon conditioning">🏃</div>
              <h3 className="section-title">{player.cardTitles?.card2 || 'Conditioning'}</h3>
            </div>
            {player.plan.card2Focus && (
              <div className="section-focus">
                <strong>Key Focus:</strong> {player.plan.card2Focus}
              </div>
            )}
            <div className="section-content" dangerouslySetInnerHTML={{ __html: parseFormatting(player.plan.card2) }} />
          </div>
        )}

        {player.plan.card3 && player.cardVisible?.card3 !== false && (
          <div className="plan-section">
            <div className="section-header">
              <div className="section-icon speed">⚡</div>
              <h3 className="section-title">{player.cardTitles?.card3 || 'Speed'}</h3>
            </div>
            {player.plan.card3Focus && (
              <div className="section-focus">
                <strong>Key Focus:</strong> {player.plan.card3Focus}
              </div>
            )}
            <div className="section-content" dangerouslySetInnerHTML={{ __html: parseFormatting(player.plan.card3) }} />
          </div>
        )}

        {player.plan.card4 && player.cardVisible?.card4 !== false && (
          <div className="plan-section">
            <div className="section-header">
              <div className="section-icon mobility">🧘</div>
              <h3 className="section-title">{player.cardTitles?.card4 || 'Mobility'}</h3>
            </div>
            {player.plan.card4Focus && (
              <div className="section-focus">
                <strong>Key Focus:</strong> {player.plan.card4Focus}
              </div>
            )}
            <div className="section-content" dangerouslySetInnerHTML={{ __html: parseFormatting(player.plan.card4) }} />
          </div>
        )}

        {player.plan.card5 && player.cardVisible?.card5 !== false && (
          <div className="plan-section">
            <div className="section-header">
              <div className="section-icon recovery">😴</div>
              <h3 className="section-title">{player.cardTitles?.card5 || 'Recovery'}</h3>
            </div>
            {player.plan.card5Focus && (
              <div className="section-focus">
                <strong>Key Focus:</strong> {player.plan.card5Focus}
              </div>
            )}
            <div className="section-content" dangerouslySetInnerHTML={{ __html: parseFormatting(player.plan.card5) }} />
          </div>
        )}

        {player.plan.card6 && player.cardVisible?.card6 !== false && (
          <div className="plan-section">
            <div className="section-header">
              <div className="section-icon nutrition">🥗</div>
              <h3 className="section-title">{player.cardTitles?.card6 || 'Nutrition'}</h3>
            </div>
            {player.plan.card6Focus && (
              <div className="section-focus">
                <strong>Key Focus:</strong> {player.plan.card6Focus}
              </div>
            )}
            <div className="section-content" dangerouslySetInnerHTML={{ __html: parseFormatting(player.plan.card6) }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerView;
