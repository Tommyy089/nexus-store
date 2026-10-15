import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ producto, onAddToCart }) {
  if (!producto) return null;

  const sinStock = Number(producto.stock) <= 0;
  const esCritico = Number(producto.stock) > 0 && Number(producto.stock) <= 5;

  return (
    <div className="card game-card-hover h-100 bg-dark text-light border-secondary border-opacity-25 rounded-4 overflow-hidden shadow-sm" data-testid="product-card">
      <div className="position-relative">
        <img
          src={producto.imagen}
          className="card-img-top object-fit-cover"
          alt={producto.nombre}
          style={{ height: '210px' }}
        />
        {producto.oferta && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-2 px-2 py-1" data-testid="badge-oferta">
            -{producto.descuento || 15}% OFERTA
          </span>
        )}
        {esCritico && (
          <span className="badge bg-warning text-dark position-absolute bottom-0 start-0 m-2 px-2 py-1" data-testid="badge-critico">
            ¡Últimas {producto.stock} unidades!
          </span>
        )}
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <span className="badge bg-secondary bg-opacity-25 align-self-start mb-2 px-2 py-1 small">
          {producto.categoria}
        </span>
        <h5 className="fw-bold text-truncate mb-1" title={producto.nombre}>
          {producto.nombre}
        </h5>
        <p className="text-info fw-bold fs-5 mt-auto mb-3">
          ${Number(producto.precio).toFixed(2)}
        </p>

        <div className="d-flex gap-2">
          <Link
            to={`/producto/${producto.id}`}
            className="btn btn-outline-light btn-sm py-2 px-3 rounded-3"
          >
            Detalle
          </Link>
          <button
            type="button"
            disabled={sinStock}
            onClick={() => onAddToCart && onAddToCart(producto)}
            className="btn btn-outline-primary flex-grow-1 fw-bold py-2 rounded-3"
          >
            {sinStock ? 'Agotado' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}