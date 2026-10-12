x
(function () {
  // 1. Estilos inyectados
  const estilosBot = document.createElement('style');
  estilosBot.innerHTML = `
    /* Botón flotante */
    .nexus-bot-launcher {
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0d6efd, #0dcaf0);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(13, 110, 253, 0.5), 0 0 20px rgba(13, 202, 240, 0.35);
      z-index: 10000;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .nexus-bot-launcher:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 15px 40px rgba(13, 110, 253, 0.8), 0 0 30px rgba(13, 202, 240, 0.6);
    }

    .nexus-bot-pulse-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #10b981;
      border-radius: 50%;
      border: 2px solid #080b11;
      box-shadow: 0 0 8px #10b981;
    }

    /* Contenedor del Chat */
    .nexus-bot-window {
      position: fixed;
      bottom: 95px;
      right: 25px;
      width: 360px;
      height: 510px;
      background: rgba(15, 21, 35, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(13, 110, 253, 0.35);
      border-radius: 1.25rem;
      box-shadow: 0 25px 65px rgba(0, 0, 0, 0.9), 0 0 25px rgba(13, 110, 253, 0.2);
      display: flex;
      flex-direction: column;
      z-index: 10000;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .nexus-bot-window.active {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Cabecera */
    .nexus-bot-header {
      background: linear-gradient(90deg, rgba(13, 110, 253, 0.2), rgba(13, 202, 240, 0.15));
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.9rem 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Área de mensajes */
    .nexus-bot-body {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .nexus-bot-body::-webkit-scrollbar {
      width: 5px;
    }
    .nexus-bot-body::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }

    .bot-msg {
      max-width: 82%;
      padding: 0.75rem 0.95rem;
      border-radius: 0.85rem;
      font-size: 0.85rem;
      line-height: 1.4;
      animation: msgPop 0.25s ease;
    }

    @keyframes msgPop {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .bot-msg-bot {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      align-self: flex-start;
      border-bottom-left-radius: 0.2rem;
    }

    .bot-msg-user {
      background: linear-gradient(135deg, #0d6efd, #0b5ed7);
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 0.2rem;
      box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
    }

    /* Botones rápidos (Chips) */
    .bot-quick-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.4rem;
    }

    .bot-chip {
      background: rgba(13, 110, 253, 0.15);
      border: 1px solid rgba(13, 110, 253, 0.35);
      color: #7dd3fc;
      border-radius: 1rem;
      padding: 0.3rem 0.65rem;
      font-size: 0.72rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .bot-chip:hover {
      background: #0d6efd;
      color: #fff;
    }

    /* Input Footer */
    .nexus-bot-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.75rem;
      background: rgba(8, 11, 17, 0.85);
      display: flex;
      gap: 0.5rem;
    }

    .nexus-bot-input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 0.65rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
      flex: 1;
      outline: none;
    }

    .nexus-bot-input:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 10px rgba(13, 110, 253, 0.4);
    }

    .nexus-bot-send {
      background: #0d6efd;
      border: none;
      color: #fff;
      border-radius: 0.65rem;
      padding: 0.5rem 0.85rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .nexus-bot-send:hover {
      transform: scale(1.08);
    }
  `;
  document.head.appendChild(estilosBot);

  // 2. Estructura HTML del Widget
  const launcher = document.createElement('div');
  launcher.className = 'nexus-bot-launcher';
  launcher.title = 'Asistente de Soporte Nexus';
  launcher.innerHTML = `
    <i class="bi bi-robot"></i>
    <span class="nexus-bot-pulse-badge"></span>
  `;

  const ventana = document.createElement('div');
  ventana.className = 'nexus-bot-window';
  ventana.innerHTML = `
    <div class="nexus-bot-header">
      <div class="d-flex align-items-center gap-2">
        <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
          <i class="bi bi-cpu-fill text-light fs-6"></i>
        </div>
        <div>
          <strong class="d-block text-light" style="font-size: 0.88rem; line-height: 1.2;">Nexus Bot AI</strong>
          <small class="text-success d-flex align-items-center gap-1" style="font-size: 0.68rem;">
            <span style="width:6px;height:6px;background:#10b981;border-radius:50%;display:inline-block;"></span> Soporte en Línea
          </small>
        </div>
      </div>
      <button class="btn btn-sm btn-link text-secondary p-0 text-decoration-none" id="btnCerrarBot">
        <i class="bi bi-x-lg fs-6"></i>
      </button>
    </div>

    <div class="nexus-bot-body" id="nexusBotMessages">
      <div class="bot-msg bot-msg-bot">
        ¡Hola! Soy el asistente automatizado de <strong>Nexus Store</strong>. ¿En qué puedo orientarte hoy?
        <div class="bot-quick-chips">
          <span class="bot-chip" data-q="canjear">¿Cómo canjear una clave?</span>
          <span class="bot-chip" data-q="wallet">¿Cómo funciona la Wallet?</span>
          <span class="bot-chip" data-q="pagos">Métodos de pago en Chile</span>
          <span class="bot-chip" data-q="reembolso">Garantía de reembolso</span>
        </div>
      </div>
    </div>

    <form class="nexus-bot-footer" id="formBotInput">
      <input type="text" class="nexus-bot-input" id="inputBotMsg" placeholder="Escribe tu consulta aquí..." autocomplete="off">
      <button type="submit" class="nexus-bot-send"><i class="bi bi-send-fill"></i></button>
    </form>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(ventana);

  // 3. Lógica de Interacción y Respuestas
  let abierto = false;
  launcher.addEventListener('click', () => {
    abierto = !abierto;
    ventana.classList.toggle('active', abierto);
  });

  document.getElementById('btnCerrarBot').addEventListener('click', () => {
    abierto = false;
    ventana.classList.remove('active');
  });

  const contenedorMensajes = document.getElementById('nexusBotMessages');
  const inputMsg = document.getElementById('inputBotMsg');

  function agregarMensaje(texto, remitente = 'bot') {
    const el = document.createElement('div');
    el.className = `bot-msg bot-msg-${remitente}`;
    el.innerHTML = texto;
    contenedorMensajes.appendChild(el);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }

  function procesarConsulta(consulta) {
    agregarMensaje(consulta, 'user');
    const q = consulta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Simular escritura rápida
    setTimeout(() => {
      let respuesta = '';

      if (q.includes('canjear') || q.includes('clave') || q.includes('codigo') || q.includes('activar')) {
        respuesta = 'Puedes ver y copiar tus claves de activación directamente en tu pestaña de <a href="biblioteca.html" class="text-info fw-bold">Biblioteca</a>. Si es una tarjeta digital de Xbox, PlayStation o Steam, dispones del botón directo para canjear en su web oficial.';
      } else if (q.includes('wallet') || q.includes('saldo') || q.includes('billetera') || q.includes('recarga')) {
        respuesta = 'Tu <strong>Nexus Wallet</strong> es una billetera prepago integrada. Puedes recargar saldo en <a href="cuenta.html" class="text-info fw-bold">Mi Cuenta</a> para compras instantáneas con 0% de comisión.';
      } else if (q.includes('pago') || q.includes('chile') || q.includes('webpay') || q.includes('tarjeta') || q.includes('mach') || q.includes('tenpo')) {
        respuesta = 'Aceptamos tarjetas de Crédito, Débito / Redcompra mediante <strong>Webpay Transbank</strong>, tarjetas prepago digitales (MACH, Tenpo) y saldo directo de tu Nexus Wallet.';
      } else if (q.includes('reembolso') || q.includes('devolucion') || q.includes('garantia')) {
        respuesta = 'Nexus cuenta con una garantía de reembolso de <strong>14 días</strong> desde la compra, siempre que el título registre menos de 2 horas de tiempo de juego.';
      } else if (q.includes('oracle') || q.includes('admin') || q.includes('backend')) {
        respuesta = 'Nexus Store opera sobre una arquitectura Spring Boot con persistencia relacional en Oracle DB. Los administradores pueden auditar métricas en <a href="admin.html" class="text-info fw-bold">admin.html</a>.';
      } else {
        respuesta = 'Entiendo. Para casos específicos sobre pagos o incidencias técnicas, puedes levantar un ticket formal desde nuestra sección de <a href="contacto.html" class="text-info fw-bold">Contacto y Soporte</a>.';
      }

      agregarMensaje(respuesta, 'bot');
    }, 400);
  }

  document.getElementById('formBotInput').addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = inputMsg.value.trim();
    if (!texto) return;
    inputMsg.value = '';
    procesarConsulta(texto);
  });

  // Delegar clicks en los chips sugeridos
  contenedorMensajes.addEventListener('click', (e) => {
    if (e.target.classList.contains('bot-chip')) {
      const prompt = e.target.textContent;
      procesarConsulta(prompt);
    }
  });
})();