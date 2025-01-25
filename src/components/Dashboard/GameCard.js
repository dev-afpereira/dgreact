import React from 'react';
import './GameCard.css';

function GameCard({ game, onPlay }) {
  return (
    <div className="game-card" onClick={onPlay}>
      <img src={game.imageUrl} alt={game.title} className="game-image" />
      <h3 className="game-title">{game.title}</h3>
      <p className="game-description">{game.description}</p>
      <p className="game-players">{game.players}</p>
      <button className="play-button">Jogar</button>
    </div>
  );
}

export default GameCard;