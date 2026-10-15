import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataStore } from '../data/dataStore';
import ProductCard from '../components/ProductCard';

const HERO_ITEMS = [
  {
    id: 1,
    titulo: 'Grand Theft Auto VI',
    badge: 'EDICIÓN ESPECIAL',
    plataforma: 'PC Digital',
    precio: 99.99,
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    descripcion: 'Explora el estado de Leonida y sus calles bañadas en neón en un mundo abierto masivo y cinematográfico de última generación.'
  },
  {
    id: 2,
    titulo: 'Cyberpunk 2077',
    badge: 'OFERTA DESTACADA',
    plataforma: 'GOG / PC',
    precio: 44.99,
    descuento: '-15%',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    descripcion: 'Conviértete en V, un mercenario urbano en Night City. Compatible con trazado de rayos completo y DLSS 3.5.'
  },
  {
    id: 3,
    titulo: 'EA SPORTS FC™ 27',
    badge: 'NOVEDAD',
    plataforma: 'EA App',
    precio: 80.99,
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    descripcion: 'La experiencia de fútbol definitiva con la tecnología HyperMotionV más realista y Ultimate Team renovado.'
  },
  {
    id: 4,
    titulo: 'God of War Ragnarök',
    badge: 'ÉXITO EN VENTAS',
    plataforma: 'PlayStation PC',
    precio: 50.99,
    descuento: '-20%',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    descripcion: 'Kratos y Atreus se embarcan en un viaje mítico a través de los Nueve Reinos en busca de respuestas.'
  }
];

export default function Home() {
  const [activoIdx, setActivoIdx] = useState(0);
  const [productos, setProductos] = useState([]);
  const itemActivo = HERO_ITEMS[activoIdx];

  useEffect(() => {
    setProductos(dataStore.getProductos());
    const timer = setInterval(() => {
      setActivoIdx((prev) => (prev + 1) % HERO_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const agregarAlCarrito = (prod) => {
    const carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
    const index = carrito.findIndex((it) => Number(it.id) === Number(prod.id));
    if (index !== -1) {
      carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    } else {
      carrito.push({ ...prod, nombre: prod.nombre || prod.titulo, cantidad: 1 });
    }
    localStorage.setItem('nexus_carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('nexus_sync'));
    window.alert(`"${prod.nombre || prod.titulo}" añadido al carrito.`);
  };

  return (
    <div className="container-fluid px-lg-5 py-4">
      <div className="row g-4 mb-5 align-items-stretch">
        <div className="col-xl-9 col-lg-8">
          <div
            className="rounded-4 p-4 p-md-5 d-flex flex-column justify-content-end position-relative overflow-hidden shadow-lg h-100"
            style={{
              minHeight: '440px',
              backgroundImage: `linear-gradient(to top, rgba(8,11,17,0.95) 15%, rgba(8,11,17,0.4) 60%, rgba(8,11,17,0.1)), url(${itemActivo.banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary px-3 py-1 fw-bold">{itemActivo.badge}</span>
              <span className="text-secondary small fw-semibold">• {itemActivo.plataforma}</span>
            </div>
            <h1 className="display-5 fw-bold mb-2 text-light">{itemActivo.titulo}</h1>
            <p className="text-light text-opacity-75 fs-6 mb-4 col-md-9">{itemActivo.descripcion}</p>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <button
                onClick={() => agregarAlCarrito({ id: itemActivo.id, nombre: itemActivo.titulo, precio: itemActivo.precio })}
                className="btn btn-primary btn-lg fw-bold px-4 rounded-3 shadow"
              >
                Comprar Ahora ${itemActivo.precio}
              </button>
              <Link to="/categorias" className="btn btn-outline-light btn-lg px-4 rounded-3">
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-4 d-flex flex-column gap-2 justify-content-between">
          {HERO_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActivoIdx(idx)}
              className={`playlist-card ${idx === activoIdx ? 'active' : ''}`}
            >
              <div className="playlist-progress-bar"></div>
              <img src={item.banner} alt={item.titulo} className="rounded-2 object-fit-cover flex-shrink-0" style={{ width: '55px', height: '65px' }} />
              <div className="overflow-hidden flex-grow-1">
                <span className="d-block fw-bold text-light text-truncate">{item.titulo}</span>
                <span className="small text-info fw-bold">${item.precio}</span>
                {item.descuento && <span className="badge bg-danger ms-2 small">{item.descuento}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <div>
          <h3 className="fw-bold m-0 text-light">Catálogo Disponible</h3>
          <small className="text-secondary">Sincronizado con el gestor CRUD en JavaScript</small>
        </div>
        <Link to="/categorias" className="btn btn-outline-secondary btn-sm rounded-pill px-3 text-light">Ver todo</Link>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 mb-5" data-testid="home-product-list">
        {productos.map((p) => (
          <div key={p.id} className="col">
            <ProductCard producto={p} onAddToCart={agregarAlCarrito} />
          </div>
        ))}
      </div>
    </div>
  );
}