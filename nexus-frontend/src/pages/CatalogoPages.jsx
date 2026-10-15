import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { dataStore } from '../data/dataStore';
import ProductCard from '../components/ProductCard';

const agregarItemCarrito = (prod) => {
  const carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
  const idx = carrito.findIndex((it) => Number(it.id) === Number(prod.id));
  if (idx !== -1) {
    carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  localStorage.setItem('nexus_carrito', JSON.stringify(carrito));
  window.dispatchEvent(new Event('nexus_sync'));
  window.alert(`"${prod.nombre}" añadido al carrito.`);
};

export function Categorias() {
  const categorias = dataStore.getCategorias();
  const [catSeleccionada, setCatSeleccionada] = useState('Todas');
  const [searchParams, setSearchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get('buscar') || '';
  const productos = dataStore.getProductos();

  const filtrados = productos.filter((p) => {
    const coincideCat = catSeleccionada === 'Todas' || p.categoria === catSeleccionada;
    const coincideTexto = !terminoBusqueda || p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
    return coincideCat && coincideTexto;
  });

  return (
    <div className="container-fluid px-lg-5 py-5 text-light">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h2 className="fw-bold m-0">Catálogo por Categorías</h2>
        {terminoBusqueda && (
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-info text-dark fs-6">Filtro: "{terminoBusqueda}"</span>
            <button onClick={() => setSearchParams({})} className="btn btn-outline-light btn-sm rounded-pill">Limpiar filtro</button>
          </div>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn ${catSeleccionada === 'Todas' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-3`}
          onClick={() => setCatSeleccionada('Todas')}
        >
          Todas
        </button>
        {categorias.map((c, i) => (
          <button
            key={i}
            className={`btn ${catSeleccionada === c ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-3`}
            onClick={() => setCatSeleccionada(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="alert alert-warning bg-dark text-warning border-warning">
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
          {filtrados.map((p) => (
            <div key={p.id} className="col">
              <ProductCard producto={p} onAddToCart={agregarItemCarrito} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DetalleProducto() {
  const { id } = useParams();
  const producto = dataStore.getProductoById(id);

  if (!producto) {
    return (
      <div className="container py-5 text-light text-center">
        <h3>Producto no encontrado</h3>
        <Link to="/categorias" className="btn btn-primary mt-3">Volver al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 text-light">
      <div className="row g-5 align-items-center bg-dark p-4 p-md-5 rounded-4 border border-secondary border-opacity-25 shadow">
        <div className="col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded-4 shadow w-100 object-fit-cover" style={{ maxHeight: '400px' }} />
        </div>
        <div className="col-md-6">
          <span className="badge bg-primary mb-2">{producto.categoria}</span>
          <h1 className="fw-bold mb-3">{producto.nombre}</h1>
          <p className="text-secondary fs-5 mb-4">{producto.descripcion}</p>
          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="text-info fw-bold m-0">${Number(producto.precio).toFixed(2)}</h2>
            <span className={`badge ${producto.stock <= 5 ? 'bg-warning text-dark' : 'bg-success'}`}>
              Stock disponible: {producto.stock} unidades
            </span>
          </div>
          <div className="d-flex gap-3">
            <button onClick={() => agregarItemCarrito(producto)} className="btn btn-primary btn-lg fw-bold px-4">
              Añadir al Carrito
            </button>
            <Link to="/categorias" className="btn btn-outline-secondary btn-lg px-4">
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Ofertas() {
  const ofertas = dataStore.getProductos().filter((p) => p.oferta);
  return (
    <div className="container-fluid px-lg-5 py-5 text-light">
      <h2 className="fw-bold mb-4">Títulos en Oferta Especial</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
        {ofertas.map((p) => (
          <div key={p.id} className="col">
            <ProductCard producto={p} onAddToCart={agregarItemCarrito} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Blog() {
  const articulos = [
    {
      id: 1,
      titulo: 'Los lanzamientos más esperados de la temporada 2026',
      fecha: '12 de Octubre, 2026',
      categoria: 'Lanzamientos',
      imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      resumen: 'Analizamos los títulos de nueva generación que revolucionan el trazado de rayos en PC y consolas.'
    },
    {
      id: 2,
      titulo: 'Guía de optimización para motores gráficos de última generación',
      fecha: '08 de Octubre, 2026',
      categoria: 'Tecnología',
      imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      resumen: 'Consejos clave para exprimir cada frame por segundo en monitores competitivos.'
    }
  ];

  return (
    <div className="container py-5 text-light">
      <h2 className="fw-bold mb-4">Nexus Gaming Blog</h2>
      <div className="row g-4">
        {articulos.map((art) => (
          <div key={art.id} className="col-md-6">
            <div className="card h-100 bg-dark text-light border-secondary border-opacity-25 rounded-4 overflow-hidden shadow">
              <img src={art.imagen} className="card-img-top object-fit-cover" alt={art.titulo} style={{ height: '220px' }} />
              <div className="card-body p-4">
                <span className="badge bg-primary mb-2">{art.categoria}</span>
                <h4 className="fw-bold">{art.titulo}</h4>
                <p className="text-secondary small">{art.resumen}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Nosotros() {
  return (
    <div className="container py-5 text-light" style={{ maxWidth: '800px' }}>
      <h2 className="fw-bold mb-3">Sobre Nexus Store</h2>
      <p className="text-secondary fs-5">
        Somos la tienda líder en distribución de licencias digitales de videojuegos en Chile, desarrollada bajo arquitectura SPA con React y Bootstrap 5 para Duoc UC.
      </p>
    </div>
  );
}

export function Contacto() {
  const [enviado, setEnviado] = useState(false);
  return (
    <div className="container py-5 text-light" style={{ maxWidth: '650px' }}>
      <h2 className="fw-bold mb-4">Contacto y Soporte</h2>
      {enviado && <div className="alert alert-success">Mensaje enviado correctamente.</div>}
      <form onSubmit={(e) => { e.preventDefault(); setEnviado(true); }}>
        <div className="mb-3">
          <label className="form-label small text-secondary">Nombre</label>
          <input type="text" className="form-control bg-dark text-light border-secondary" required />
        </div>
        <div className="mb-3">
          <label className="form-label small text-secondary">Correo</label>
          <input type="email" className="form-control bg-dark text-light border-secondary" required />
        </div>
        <div className="mb-3">
          <label className="form-label small text-secondary">Mensaje</label>
          <textarea rows="4" className="form-control bg-dark text-light border-secondary" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary px-4 fw-bold">Enviar Mensaje</button>
      </form>
    </div>
  );
}