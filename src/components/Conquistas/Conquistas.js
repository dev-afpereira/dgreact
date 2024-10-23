import React, { useEffect, useState } from 'react';
import './Conquistas.css';

function Conquistas({ conquistas, novasConquistas }) {
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  const [conquistaAtual, setConquistaAtual] = useState(null);

  useEffect(() => {
    if (novasConquistas && novasConquistas.length > 0) {
      setConquistaAtual(novasConquistas[0]);
      setMostrarNotificacao(true);
      
      const timer = setTimeout(() => {
        setMostrarNotificacao(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [novasConquistas]);

  return (
    <>
      {/* Painel de Conquistas */}
      <div className="conquistas-painel">
        <h3>Suas Conquistas</h3>
        <div className="conquistas-grid">
          {conquistas.map(conquista => (
            <div key={conquista.id} className="conquista-item">
              <span className="conquista-icone">{conquista.icone}</span>
              <div className="conquista-info">
                <h4>{conquista.nome}</h4>
                <p>{conquista.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notificação de Nova Conquista */}
      {mostrarNotificacao && conquistaAtual && (
        <div className="conquista-notificacao">
          <div className="conquista-notificacao-content">
            <span className="conquista-icone-grande">{conquistaAtual.icone}</span>
            <div className="conquista-notificacao-texto">
              <h4>Nova Conquista!</h4>
              <p>{conquistaAtual.nome}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Conquistas;