import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [usuarioActual, setUsuarioActual] = useState(
    localStorage.getItem('nexus_usuario') || 'vicentetomasgonzalez690'
  );
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const syncState = () => {
    const items = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
    const suma = items.reduce((acc, it) => acc + Number(it.precio) * (it.cantidad || 1), 0);
    setTotalCarrito(suma);
    setUsuarioActual(localStorage.getItem('nexus_usuario') || 'Invitado');
  };

  useEffect(() => {
    syncState();
    window.addEventListener('storage', syncState);
    window.addEventListener('nexus_sync', syncState);
    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener('nexus_sync', syncState);
    };
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    navigate(`/categorias?buscar=${encodeURIComponent(busqueda.trim())}`);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('nexus_usuario');
    setUsuarioActual('Invitado');
    window.dispatchEvent(new Event('nexus_sync'));
  };

  return (
    <header className="sticky-top bg-black border-bottom border-secondary border-opacity-25 shadow-sm" style={{ zIndex: 1050 }}>
      <div className="container-fluid px-lg-5 py-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-light fw-bold fs-4">
            <i className="bi bi-controller text-primary fs-3"></i>
            <span>Nexus</span>
          </Link>

          <form className="d-flex col-12 col-md-4 my-1 my-md-0" onSubmit={handleBuscar} role="search">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                aria-label="Buscar juego"
                className="form-control bg-dark text-light border-secondary border-opacity-50"
                placeholder="Buscar juego por título..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Buscar</button>
            </div>
          </form>

          <div className="d-flex align-items-center gap-2">
            <Link to="/carrito" className="btn btn-success fw-bold d-flex align-items-center gap-2 px-3 py-1 rounded-pill">
              <i className="bi bi-cart3"></i>
              <span data-testid="navbar-cart-total">${totalCarrito.toFixed(2)}</span>
            </Link>

            <Link to="/admin" className="btn btn-warning btn-sm rounded-pill px-3 fw-bold">
              <i className="bi bi-shield-lock-fill me-1"></i> Admin
            </Link>

            {usuarioActual && usuarioActual !== 'Invitado' ? (
              <div className="dropdown">
                <button className="btn btn-dark border-secondary btn-sm rounded-pill px-3 py-1 text-light dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                  <span className="status-dot"></span>
                  <span className="small text-truncate" style={{ maxWidth: '140px' }}>{usuarioActual}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                  <li><Link className="dropdown-item small" to="/admin">Panel Admin</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item small text-danger" onClick={handleCerrarSesion}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold">
                Ingresar
              </Link>
            )}
          </div>
        </div>

        <nav className="nav nav-underline mt-2 border-top border-secondary border-opacity-10 pt-2 gap-2 flex-nowrap overflow-auto">
          <Link className="nav-link text-light text-opacity-75 py-1 px-3" to="/">Home</Link>
          <Link className="nav-link text-light text-opacity-75 py-1 px-3" to="/categorias">Categorías</Link>
          <Link className="nav-link text-light text-opacity-75 py-1 px-3" to="/ofertas">Ofertas</Link>
          <Link className="nav-link text-light text-opacity-75 py-1 px-3" to="/blog">Blog</Link>
          <Link className="nav-link text-light text-opacity-75 py-1 px-3" to="/nosotros">Nosotros</Link>
          <Link className="nav-link text-light text-opacity-75 py-1 px-3" to="/contacto">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}