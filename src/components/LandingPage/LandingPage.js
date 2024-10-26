import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from '../UserMenu/UserMenu';
import {
  Trophy,
  Users,
  Target,
  Brain,
  Star,
  ChevronRight
} from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'Estratégia & Sorte',
      description: 'Combine habilidade estratégica com a emoção do acaso'
    },
    {
      icon: Users,
      title: 'Multijogador',
      description: 'Jogue com amigos ou desafie jogadores do mundo todo'
    },
    {
      icon: Trophy,
      title: 'Conquistas',
      description: 'Desbloqueie conquistas e suba de nível'
    },
    {
      icon: Target,
      title: 'Diversos Modos',
      description: 'Normal, Melhor de 3 e modo Torneio'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-text">Mestre da Adivinhação</span>
        </div>
        <div className="nav-buttons">
          {currentUser ? (
            <UserMenu />
          ) : (
            <>
              <button
                className="nav-button"
                onClick={() => navigate('/login')}
              >
                Entrar
              </button>
              <button
                className="nav-button primary"
                onClick={() => navigate('/register')}
              >
                Registrar
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Jogue, Desafie e Conquiste!</h1>
          <p>
            A plataforma definitiva para testar suas habilidades
            e sorte no jogo do número.
          </p>
          <div className="hero-buttons">
            <button
              className="hero-button primary"
              onClick={() => currentUser ? navigate('/dashboard') : navigate('/register')}
            >
              {currentUser ? 'Ir para o Jogo' : 'Comece a Jogar'}
            </button>
            <button
              className="hero-button secondary"
              onClick={() => {
                const howToPlay = document.getElementById('how-to-play');
                howToPlay?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Como Jogar
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Recursos Incríveis</h2>
          <p>Descubra o que torna nosso jogo especial</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon size={48} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Play Section */}
      <section className="how-to-play-section" id="how-to-play">
        <div className="section-header">
          <h2>Como Jogar</h2>
          <p>Aprenda em 3 passos simples</p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Crie uma Conta</h3>
            <p>Comece criando uma conta gratuita e personalize seu perfil.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Entre em uma Sala</h3>
            <p>Encontre uma sala de espera com outros jogadores ou crie a sua própria.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Escolha seu Número</h3>
            <p>Selecione um número entre 1 e 10 e boa sorte!</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-header">
          <h2>Nossos Números</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <Star size={48} />
            <span className="stat-value">1000+</span>
            <span className="stat-label">Jogadores Ativos</span>
          </div>
          <div className="stat-card">
            <Trophy size={48} />
            <span className="stat-value">10000+</span>
            <span className="stat-label">Partidas Jogadas</span>
          </div>
          <div className="stat-card">
            <Users size={48} />
            <span className="stat-value">100+</span>
            <span className="stat-label">Clãs Criados</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Pronto para começar?</h2>
        <p>Entre agora e receba bônus especiais para novos jogadores!</p>
        <button
          className="cta-button"
          onClick={() => currentUser ? navigate('/dashboard') : navigate('/register')}
        >
          {currentUser ? 'Ir para o Jogo' : 'Criar Conta Grátis'}
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Número da Sorte</h4>
            <p>Um jogo de estratégia multiplayer</p>
          </div>
          <div className="footer-section">
            <h4>Links Úteis</h4>
            <ul>
              <li><a href="#how-to-play">Como Jogar</a></li>
              <li><a href="/ranking">Ranking</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Registrar</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Suporte</h4>
            <ul>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contato</a></li>
              <li><a href="/terms">Termos de Uso</a></li>
              <li><a href="/privacy">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Mestre da Adivinhação. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;