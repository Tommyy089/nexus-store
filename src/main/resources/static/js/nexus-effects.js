// ==========================================================================
// NEXUS EFFECTS: SISTEMA DE CONFETI Y LOGROS ESTILO CONSOLA (AAA)
// ==========================================================================

(function () {
  // 1. Cargar biblioteca canvas-confetti dinámicamente si no está presente
  if (!window.confetti) {
    const scriptConfetti = document.createElement('script');
    scriptConfetti.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    document.head.appendChild(scriptConfetti);
  }

  // 2. Inyectar estilos visuales del Pop-up de Logro
  const estilosLogro = document.createElement('style');
  estilosLogro.innerHTML = `
    .nexus-achievement-banner {
      position: fixed;
      bottom: 25px;
      right: 25px;
      z-index: 99999;
      background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(8, 11, 17, 0.98));
      border: 1px solid rgba(255, 193, 7, 0.5);
      border-radius: 1rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 193, 7, 0.25);
      backdrop-filter: blur(16px);
      padding: 1rem 1.4rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #fff;
      transform: translateX(120%);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      max-width: 380px;
      overflow: hidden;
    }

    .nexus-achievement-banner.show {
      transform: translateX(0);
      opacity: 1;
    }

    .nexus-achievement-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #d97706);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #000;
      box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
      flex-shrink: 0;
      animation: rotateBadge 1.2s ease;
    }

    @keyframes rotateBadge {
      0% { transform: scale(0) rotate(-180deg); }
      70% { transform: scale(1.2) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    .nexus-achievement-glow-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #fbbf24, #0dcaf0, #0d6efd);
    }
  `;
  document.head.appendChild(estilosLogro);

  // 3. Sintetizador de audio (Sonido de logro sin archivos externos)
  function reproducirSonidoLogro() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notas = [523.25, 659.25, 783.99, 1046.50]; // Acorde C mayor (C5, E5, G5, C6)

      notas.forEach((frecuencia, i) => {
        const oscilador = audioCtx.createOscillator();
        const ganancia = audioCtx.createGain();

        oscilador.type = 'triangle';
        oscilador.frequency.setValueAtTime(frecuencia, audioCtx.currentTime + (i * 0.08));

        ganancia.gain.setValueAtTime(0.12, audioCtx.currentTime + (i * 0.08));
        ganancia.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (i * 0.08) + 0.5);

        oscilador.connect(ganancia);
        ganancia.connect(audioCtx.destination);

        oscilador.start(audioCtx.currentTime + (i * 0.08));
        oscilador.stop(audioCtx.currentTime + (i * 0.08) + 0.55);
      });
    } catch (e) {
      // Si el navegador bloquea audio por falta de interacción previa
    }
  }

  // 4. API pública NexusEffects
  window.NexusEffects = {
    lanzarConfetti: function () {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d6efd', '#0dcaf0', '#fbbf24', '#ffffff']
        });
      }
    },

    desbloquearLogro: function (titulo, descripcion, iconoClase = 'bi-trophy-fill') {
      reproducirSonidoLogro();
      this.lanzarConfetti();

      // Eliminar banner previo si existe
      const viejo = document.querySelector('.nexus-achievement-banner');
      if (viejo) viejo.remove();

      // Crear banner DOM
      const banner = document.createElement('div');
      banner.className = 'nexus-achievement-banner';
      banner.innerHTML = `
        <div class="nexus-achievement-glow-bar"></div>
        <div class="nexus-achievement-icon-wrap">
          <i class="bi ${iconoClase}"></i>
        </div>
        <div>
          <small class="text-warning text-uppercase fw-bold d-block" style="font-size: 0.68rem; letter-spacing: 1px;">
            <i class="bi bi-star-fill me-1"></i> Logro Desbloqueado
          </small>
          <strong class="d-block text-light fs-6 mb-0">${titulo}</strong>
          <small class="text-secondary" style="font-size: 0.78rem;">${descripcion}</small>
        </div>
      `;

      document.body.appendChild(banner);

      // Animación de entrada y salida
      setTimeout(() => banner.classList.add('show'), 50);

      setTimeout(() => {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 600);
      }, 4500);
    }
  };
})();