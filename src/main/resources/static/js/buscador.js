// js/buscador.js - Filtro por teclado y categorías para Nexus
document.addEventListener('DOMContentLoaded', () => {
  const inputBuscar = document.getElementById('inputBuscarJuego');
  const botonesFiltro = document.querySelectorAll('#grupoFiltros button');
  const tarjetasJuegos = document.querySelectorAll('.card-juego');

  if (!inputBuscar) return;

  let categoriaActual = 'todos';
  let textoBusqueda = '';

  // 1. Filtrar al escribir en tiempo real con el teclado
  inputBuscar.addEventListener('input', (e) => {
    textoBusqueda = e.target.value.toLowerCase().trim();
    aplicarFiltros();
  });

  // 2. Filtrar al hacer clic en las categorías (Todos, Acción, etc.)
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', (e) => {
      // Cambiar diseño visual de los botones activos
      botonesFiltro.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline-secondary', 'border-opacity-50', 'text-light');
      });
      e.target.classList.remove('btn-outline-secondary', 'border-opacity-50', 'text-light');
      e.target.classList.add('btn-primary');

      categoriaActual = e.target.getAttribute('data-filtro');
      aplicarFiltros();
    });
  });

  // 3. Lógica combinada de búsqueda y categoría
  function aplicarFiltros() {
    let visibles = 0;

    tarjetasJuegos.forEach(tarjeta => {
      const titulo = tarjeta.getAttribute('data-titulo') || '';
      const genero = tarjeta.getAttribute('data-genero') || '';

      const coincideTexto = titulo.includes(textoBusqueda);
      const coincideCategoria = (categoriaActual === 'todos' || genero.includes(categoriaActual));

      if (coincideTexto && coincideCategoria) {
        tarjeta.style.display = ''; // Mostrar tarjeta
        visibles++;
      } else {
        tarjeta.style.display = 'none'; // Ocultar tarjeta
      }
    });

    // Controlar mensaje si no hay coincidencias
    let mensajeVacio = document.getElementById('mensajeSinResultados');
    const contenedorGrid = document.getElementById('gridJuegos');

    if (visibles === 0) {
      if (!mensajeVacio && contenedorGrid) {
        mensajeVacio = document.createElement('div');
        mensajeVacio.id = 'mensajeSinResultados';
        mensajeVacio.className = 'col-12 text-center py-5 text-secondary';
        mensajeVacio.innerHTML = `
          <i class="bi bi-search display-4 mb-3 d-block opacity-50"></i>
          <h4>No se encontraron juegos</h4>
          <p>Prueba buscando con otro término o selecciona otra categoría.</p>
        `;
        contenedorGrid.appendChild(mensajeVacio);
      }
    } else {
      if (mensajeVacio) mensajeVacio.remove();
    }
  }
});