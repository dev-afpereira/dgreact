import React, { useState, useEffect, useRef } from 'react';
import { ref, update, onValue, get } from 'firebase/database';
import './JogoDoNumero.css';
import Chat from '../Chat/Chat';
import Conquistas from '../Conquistas/Conquistas';
import Ranking from  '../Ranking/Ranking';

import { verificarConquistas } from '../../services/ConquistasService';
import { registrarPartida } from '../../services/HistoricoService';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
}

function JogoDoNumero({ playerId, database, gameId, onExitGame }) {
  const [selectedNumber, setSelectedNumber] = useState('');
  const [currentTurn, setCurrentTurn] = useState('');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState({});
  const [diceResult, setDiceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameMode, setGameMode] = useState('normal');
  const [roundWins, setRoundWins] = useState({});
  const [conquistas, setConquistas] = useState([]);
  const [novasConquistas, setNovasConquistas] = useState([]);
  
  const [partidaStats, setPartidaStats] = useState({
    acertos: 0,
    melhorSequencia: 0,
    sequenciaAtual: 0
  });
  
  const messageRef = useRef(null);
  const diceRef = useRef(null);

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);
    return onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentTurn(data.currentTurn || Object.keys(data.players)[0]);
        setMessage(data.message || '');
        setPlayers(data.players || {});
        setDiceResult(data.diceResult || null);
        setGameMode(data.gameMode || 'normal');
        setRoundWins(data.roundWins || {});

        if (data.players[playerId]?.conquistas) {
          setConquistas(data.players[playerId].conquistas);
        }
      }
    });
  }, [database, gameId, playerId]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.classList.remove('new-message');
      void messageRef.current.offsetWidth;
      messageRef.current.classList.add('new-message');
    }
  }, [message]);

  const calculateLevel = (score) => {
    if (score <= 50) return 1;
    if (score <= 100) return 2;
    if (score <= 200) return 3;
    if (score <= 500) return 4;
    return 5;
  };

  const handleNumberSubmit = async (e) => {
    e.preventDefault();
    if (selectedNumber >= 1 && selectedNumber <= 10) {
      setIsLoading(true);
      try {
        await update(ref(database, `games/${gameId}/players/${playerId}`), {
          number: selectedNumber
        });
        setSelectedNumber('');
      } catch (error) {
        console.error("Erro ao submeter número:", error);
        alert("Houve um erro ao submeter seu número. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Por favor, escolha um número entre 1 e 10.');
    }
  };

  const atualizarConquistas = async (playerData) => {
    const novasConquistasEncontradas = verificarConquistas(playerData, conquistas.map(c => c.id));
    
    if (novasConquistasEncontradas.length > 0) {
      const conquistasAtualizadas = [...conquistas, ...novasConquistasEncontradas];
      await update(ref(database, `games/${gameId}/players/${playerId}`), {
        conquistas: conquistasAtualizadas
      });
      
      setNovasConquistas(novasConquistasEncontradas);
      setTimeout(() => setNovasConquistas([]), 3000);
    }
  };

  const atualizarEstatisticasGlobais = async (novasStats) => {
    try {
      const playerStatsRef = ref(database, `players/${playerId}/estatisticas`);
      const snapshot = await get(playerStatsRef);
      const statsAtuais = snapshot.val() || {
        pontuacaoTotal: 0,
        vitorias: 0,
        derrotas: 0,
        partidasJogadas: 0,
        melhorSequencia: 0,
        totalAcertos: 0
      };

      const statsAtualizadas = {
        pontuacaoTotal: statsAtuais.pontuacaoTotal + novasStats.pontuacao,
        vitorias: statsAtuais.vitorias + (novasStats.venceu ? 1 : 0),
        derrotas: statsAtuais.derrotas + (novasStats.venceu ? 0 : 1),
        partidasJogadas: statsAtuais.partidasJogadas + 1,
        melhorSequencia: Math.max(statsAtuais.melhorSequencia, novasStats.melhorSequencia),
        totalAcertos: statsAtuais.totalAcertos + novasStats.acertos,
        ultimoJogo: Date.now()
      };

      await update(ref(database, `players/${playerId}`), {
        estatisticas: statsAtualizadas,
        level: calculateLevel(statsAtualizadas.pontuacaoTotal)
      });
    } catch (error) {
      console.error('Erro ao atualizar estatísticas globais:', error);
    }
  };

  const finalizarPartida = async (vencedor) => {
    const statsPartida = {
      playerId,
      venceu: vencedor.id === playerId,
      pontuacao: players[playerId].score || 0,
      acertos: partidaStats.acertos,
      melhorSequencia: partidaStats.melhorSequencia,
      modo: gameMode,
      jogadores: Object.values(players).map(p => p.name),
      level: players[playerId].level || 1,
      timestamp: Date.now()
    };

    try {
      await registrarPartida(database, statsPartida);
      await atualizarEstatisticasGlobais(statsPartida);

      setPartidaStats({
        acertos: 0,
        melhorSequencia: 0,
        sequenciaAtual: 0
      });
    } catch (error) {
      console.error('Erro ao finalizar partida:', error);
    }
  };

  const renderGameModeInfo = () => {
    if (gameMode === 'bestOfThree') {
      return (
        <div className="game-mode-info">
          <h3>Modo: Melhor de 3</h3>
          {Object.entries(roundWins).map(([playerId, wins]) => (
            <p key={playerId}>{players[playerId]?.name}: {wins} vitória(s)</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const rollDice = async () => {
    setIsLoading(true);
    
    if (diceRef.current) {
      diceRef.current.classList.add('rolling');
    }
    
    try {
      const diceNumber = Math.floor(Math.random() * 10) + 1;
      const newWinners = Object.values(players).filter(player => parseInt(player.number) === diceNumber);
      
      let newMessage = `O dado rolou ${diceNumber}. `;
      if (newWinners.length > 0) {
        newMessage += `${newWinners.map(w => w.name).join(' e ')} acertou!`;
        
        if (newWinners.some(w => w.id === playerId)) {
          const novaSequencia = partidaStats.sequenciaAtual + 1;
          setPartidaStats(prev => ({
            acertos: prev.acertos + 1,
            sequenciaAtual: novaSequencia,
            melhorSequencia: Math.max(prev.melhorSequencia, novaSequencia)
          }));
        }

        await Promise.all(newWinners.map(async (winner) => {
          const playerRef = ref(database, `games/${gameId}/players/${winner.id}`);
          const playerSnapshot = await get(playerRef);
          const playerData = playerSnapshot.val();

          const consecutiveHits = (playerData.consecutiveHits || 0) + 1;
          let multiplier = 1;
          if (consecutiveHits === 2) multiplier = 1.5;
          else if (consecutiveHits === 3) multiplier = 2;
          else if (consecutiveHits >= 4) multiplier = 3;

          const newScore = playerData.score + Math.round(10 * multiplier);
          const newLevel = calculateLevel(newScore);

          const updatedPlayerData = {
            score: newScore,
            consecutiveHits: consecutiveHits,
            level: newLevel
          };

          await update(playerRef, updatedPlayerData);

          if (winner.id === playerId) {
            await atualizarConquistas({
              ...playerData,
              ...updatedPlayerData
            });
          }
        }));

        if (gameMode === 'bestOfThree') {
          const updatedRoundWins = {...roundWins};
          newWinners.forEach(winner => {
            updatedRoundWins[winner.id] = (updatedRoundWins[winner.id] || 0) + 1;
            if (updatedRoundWins[winner.id] === 3) {
              newMessage += ` ${winner.name} venceu o jogo!`;
              finalizarPartida(winner);
            }
          });
          await update(ref(database, `games/${gameId}`), { roundWins: updatedRoundWins });
        }
      } else {
        newMessage += 'Ninguém acertou desta vez.';
        if (players[playerId]?.number) {
          setPartidaStats(prev => ({
            ...prev,
            sequenciaAtual: 0
          }));
        }
        await Promise.all(Object.keys(players).map(playerId => 
          update(ref(database, `games/${gameId}/players/${playerId}`), {
            consecutiveHits: 0
          })
        ));
      }

      const playerIds = Object.keys(players);
      const nextPlayerIndex = (playerIds.indexOf(currentTurn) + 1) % playerIds.length;
      const nextPlayerId = playerIds[nextPlayerIndex];

      await update(ref(database, `games/${gameId}`), {
        currentTurn: nextPlayerId,
        message: newMessage,
        winners: newWinners.map(w => w.id),
        diceResult: diceNumber
      });

    } catch (error) {
      console.error("Erro ao rolar o dado:", error);
      alert("Houve um erro ao rolar o dado. Por favor, tente novamente.");
    } finally {
      if (diceRef.current) {
        diceRef.current.classList.remove('rolling');
      }
      setIsLoading(false);
    }
  };

  const isPlayerTurn = currentTurn === playerId;
  const hasSelectedNumber = players[playerId]?.number !== undefined && players[playerId]?.number !== '';
  const isAdmin = playerId === Object.keys(players)[0];

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="main-content">
          <h1 className="game-title">Jogo do Número</h1>
          
          <Conquistas 
            conquistas={conquistas}
            novasConquistas={novasConquistas}
          />

          {renderGameModeInfo()}
          {isLoading && <LoadingSpinner />}
          
          <div className="players-overview">
            {Object.values(players).map((player) => (
              <div 
                key={player.id} 
                className={`player-overview ${currentTurn === player.id ? 'current-turn' : ''}`}
              >
                <div className="player-name">{player.name}</div>
                <div className="player-number">{player.number || '?'}</div>
                <div className="player-score">Pontos: {player.score || 0}</div>
                <div className="player-level">Nível: {player.level || 1}</div>
                <div className="player-multiplier">
                  Multiplicador: {player.consecutiveHits === 1 ? '1x' :
                                player.consecutiveHits === 2 ? '1.5x' :
                                player.consecutiveHits === 3 ? '2x' : '3x'}
                </div>
                <div className="player-turn-info">
                  {currentTurn === player.id ? 'Sua vez!' : 'Aguarde...'}
                </div>
              </div>
            ))}
          </div>

          {message && <p ref={messageRef} className="message">{message}</p>}
          {diceResult && (
            <div className="dice-result" ref={diceRef}>
              Resultado do dado: {diceResult}
            </div>
          )}

          <div className="game-controls">
            <form onSubmit={handleNumberSubmit} className="number-input">
              <input
                type="number"
                min="1"
                max="10"
                value={selectedNumber}
                onChange={(e) => setSelectedNumber(e.target.value)}
                placeholder="1-10"
                className="input"
                disabled={hasSelectedNumber || isLoading}
              />
              <button 
                type="submit" 
                className="button" 
                disabled={hasSelectedNumber || isLoading}
              >
                Confirmar Número
              </button>
            </form>

            <div className="action-buttons">
              {isPlayerTurn && (
                <button 
                  onClick={rollDice} 
                  className="button roll-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Rolando...' : 'Girar Dado'}
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={onExitGame} 
                  className="button reset-button" 
                  disabled={isLoading}
                >
                  Reiniciar Jogo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="game-sidebar">
          <Ranking 
            database={database}
            currentPlayerId={playerId}
          />

          <div className="chat-container">
            <Chat 
              gameId={gameId}
              playerId={playerId}
              playerName={players[playerId]?.name || ''}
              database={database}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JogoDoNumero;