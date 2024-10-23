import React, { useState } from 'react';
import './GameCard.css';

function GameCard({ game, onPlay }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="game-card">
      <div 
        className="game-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="game-image">
          <img src={game.image || '/default-game.jpg'} alt={game.title} />
          {game.new && <span className="new-badge">Novo!</span>}
        </div>
        <div className="game-info">
          <h3>{game.title}</h3>
          <p className="game-description">{game.description}</p>
          <div className="game-stats">
            <div className="stat">
              <i className="fas fa-users"></i>
              <span>Online: {game.onlinePlayers || 0}</span>
            </div>
            <div className="stat">
              <i className="fas fa-gamepad"></i>
              <span>Partidas: {game.activeGames || 0}</span>
            </div>
          </div>
        </div>
        <button 
          className="expand-button"
          aria-label={isExpanded ? 'Recolher' : 'Expandir'}
        >
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
        </button>
      </div>

      <div className={`game-modes ${isExpanded ? 'expanded' : ''}`}>
        <div className="modes-grid">
          {game.modes.map(mode => (
            <div 
              key={mode.id} 
              className={`mode-card ${mode.special ? 'special' : ''}`}
            >
              <div className="mode-info">
                <h4>{mode.name}</h4>
                <p>{mode.description}</p>
                <span className="players-info">
                  <i className="fas fa-users"></i> {mode.players}
                </span>
              </div>
              <div className="mode-actions">
                {mode.special ? (
                  <>
                    <span className="special-tag">Especial</span>
                    <button 
                      className="play-button special"
                      onClick={() => onPlay(mode.id)}
                    >
                      Jogar
                      <i className="fas fa-crown"></i>
                    </button>
                  </>
                ) : (
                  <button 
                    className="play-button"
                    onClick={() => onPlay(mode.id)}
                  >
                    Jogar
                    <i className="fas fa-play"></i>
                  </button>
                )}
              </div>
              {mode.active && (
                <div className="active-players">
                  <span className="dot"></span>
                  {mode.activePlayers} jogando
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameCard;