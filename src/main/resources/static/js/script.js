document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const gameItems = document.querySelectorAll('.game-item');
  const loginBtn = document.getElementById('loginBtn');

  // Filtro de búsqueda interactivo en tiempo real
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    gameItems.forEach(item => {
      const title = item.querySelector('.card-title').textContent.toLowerCase();
      if (title.includes(query)) {
        item.classList.remove('d-none');
      } else {
        item.classList.add('d-none');
      }
    });
  });

  // Simulación de Inicio de Sesión
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const user = prompt('Ingrese su usuario para iniciar sesión:');
    if (user) {
      loginBtn.innerHTML = `<i class="bi bi-person-check-fill text-success"></i> <span>${user}</span>`;
      loginBtn.classList.replace('btn-outline-light', 'btn-dark');
    }
  });
});