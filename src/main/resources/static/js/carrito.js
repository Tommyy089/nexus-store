// js/carrito.js - Lógica global del carrito y pasarela de pago para Nexus
document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();
  inicializarBotonesComprar();
  renderizarContenidoCarrito();
  configurarPasarelaPago();
});

// Añadir productos al localStorage
function inicializarBotonesComprar() {
  const botonesComprar = document.querySelectorAll('.btn-agregar-carrito');

  botonesComprar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      const titulo = boton.getAttribute('data-titulo');
      const precio = boton.getAttribute('data-precio');
      const imagen = boton.getAttribute('data-imagen');

      if (!titulo) return;

      let carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
      
      carrito.push({ titulo, precio, imagen });
      localStorage.setItem('nexus_carrito', JSON.stringify(carrito));

      actualizarContadorCarrito();
      renderizarContenidoCarrito();

      // Mostrar el offcanvas del carrito automáticamente
      const carritoElemento = document.getElementById('carritoLateral');
      if (carritoElemento) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(carritoElemento) || new bootstrap.Offcanvas(carritoElemento);
        bsOffcanvas.show();
      }
    });
  });
}

// Actualizar el número en la burbuja del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
  const badges = document.querySelectorAll('.badge-contador-carrito');
  badges.forEach(badge => {
    badge.textContent = carrito.length;
    badge.style.display = carrito.length > 0 ? 'inline-block' : 'none';
  });
}

// Renderizar los elementos dentro del Offcanvas
function renderizarContenidoCarrito() {
  const contenedor = document.getElementById('contenedorCarritoItems');
  const subtotalElemento = document.getElementById('carritoSubtotal');
  if (!contenedor) return;

  const carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
  
  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center text-secondary py-5">
        <i class="bi bi-cart-x display-4 mb-3 d-block"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    if (subtotalElemento) subtotalElemento.textContent = 'US$0.00';
    return;
  }

  let html = '';
  let subtotal = 0;

  carrito.forEach((item, index) => {
    let precioNumerico = 0;
    if (item.precio && item.precio.includes('US$')) {
      precioNumerico = parseFloat(item.precio.replace('US$', '')) || 0;
      subtotal += precioNumerico;
    }

    html += `
      <div class="d-flex gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25 align-items-center">
        <img src="${item.imagen}" alt="${item.titulo}" class="rounded-3 object-fit-cover" width="60" height="60">
        <div class="flex-grow-1">
          <h6 class="mb-1 fw-bold fs-7 text-truncate" style="max-width: 160px;">${item.titulo}</h6>
          <span class="fw-bold text-light small">${item.precio}</span>
        </div>
        <button class="btn btn-link text-danger p-0 text-decoration-none" onclick="eliminarDelCarrito(${index})" title="Eliminar">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>
    `;
  });

  contenedor.innerHTML = html;
  if (subtotalElemento) {
    subtotalElemento.textContent = subtotal > 0 ? `US$${subtotal.toFixed(2)}` : 'Gratuito';
  }
}

// Eliminar un producto específico del carrito
window.eliminarDelCarrito = function(index) {
  let carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
  carrito.splice(index, 1);
  localStorage.setItem('nexus_carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarContenidoCarrito();
};

// Configuración de la Pasarela de Pago (Modal Checkout)
function configurarPasarelaPago() {
  const btnProcederPago = document.querySelector('#carritoLateral .btn-primary');

  if (btnProcederPago) {
    btnProcederPago.addEventListener('click', (e) => {
      e.preventDefault();
      
      const carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
      if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
      }

      let subtotal = 0;
      carrito.forEach(item => {
        if (item.precio && item.precio.includes('US$')) {
          subtotal += parseFloat(item.precio.replace('US$', '')) || 0;
        }
      });

      const totalPagarEl = document.getElementById('modalTotalPagar');
      if (totalPagarEl) {
        totalPagarEl.textContent = subtotal > 0 ? `US$${subtotal.toFixed(2)}` : 'Gratuito';
      }

      // Cerrar el offcanvas del carrito
      const carritoElemento = document.getElementById('carritoLateral');
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(carritoElemento);
      if (bsOffcanvas) bsOffcanvas.hide();

      // Abrir el Modal de Pago
      const modalPagoEl = document.getElementById('modalPago');
      const bsModal = new bootstrap.Modal(modalPagoEl);
      bsModal.show();
    });
  }

  // Manejar el envío del formulario de pago simulado
  const formCheckout = document.getElementById('formCheckout');
  if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
      e.preventDefault();

      // Vaciar carrito
      localStorage.removeItem('nexus_carrito');
      
      actualizarContadorCarrito();
      renderizarContenidoCarrito();

      // Cerrar modal
      const modalPagoEl = document.getElementById('modalPago');
      const bsModal = bootstrap.Modal.getInstance(modalPagoEl);
      if (bsModal) bsModal.hide();

      alert('¡Pago procesado con éxito! Gracias por tu compra en Nexus. Tus juegos ya están listos.');
      window.location.href = 'juegos.html';
    });
  }
  document.getElementById('formCheckout')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreTitular').value;
    const metodo = document.querySelector('input[name="metodoPago"]:checked')?.id || 'Credito';
    const tipo = document.getElementById('tipoTarjeta').value;
    
    // Obtener total numérico quitando letras o símbolos
    const textoTotal = document.getElementById('modalTotalPagar')?.textContent || '0';
    const totalNumerico = parseFloat(textoTotal.replace(/[^0-9.]/g, '')) || 0;

    const datosPedido = {
        nombreCliente: nombre,
        metodoPago: metodo.replace('pago', ''),
        tipoTarjeta: tipo,
        total: totalNumerico
    };

    try {
        const respuesta = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPedido)
        });

        if (respuesta.ok) {
            const pedidoGuardado = await respuesta.json();
            
            // Cerrar modal
            const modalEl = document.getElementById('modalPago');
            const modalInstancia = bootstrap.Modal.getInstance(modalEl);
            if (modalInstancia) modalInstancia.hide();

            alert(`¡Compra procesada con éxito! Orden #${pedidoGuardado.id} registrada en la base de datos.`);
            
            // Limpiar formulario y carrito
            document.getElementById('formCheckout').reset();
            localStorage.removeItem('nexus_carrito');
            window.location.href = 'biblioteca.html';
        } else {
            alert('Error al registrar la transacción en el servidor.');
        }
    } catch (error) {
        console.error('Error procesando pago:', error);
        alert('Hubo un error de conexión con la base de datos Oracle.');
    }
});
}