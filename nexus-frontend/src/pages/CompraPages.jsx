import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { dataStore } from '../data/dataStore';

export function Carrito() {
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('nexus_carrito')) || []);
  const total = carrito.reduce((acc, it) => acc + Number(it.precio) * (it.cantidad || 1), 0);

  const eliminar = (id) => {
    if (window.confirm('¿Deseas eliminar este producto del carrito?')) {
      const act = carrito.filter((it) => Number(it.id) !== Number(id));
      setCarrito(act);
      localStorage.setItem('nexus_carrito', JSON.stringify(act));
      window.dispatchEvent(new Event('nexus_sync'));
    }
  };

  return (
    <div className="container py-5 text-light" style={{ maxWidth: '850px' }}>
      <h3 className="fw-bold mb-4 pb-2 border-bottom border-secondary border-opacity-25">Carrito de Compras</h3>
      {carrito.length === 0 ? (
        <div className="text-center py-5">
          <h5>El carrito está vacío</h5>
          <Link to="/" className="btn btn-primary mt-3 px-4 rounded-pill">Ver Tienda</Link>
        </div>
      ) : (
        <>
          <div className="table-responsive bg-dark rounded-3 p-3 mb-4 border border-secondary border-opacity-25 shadow">
            <table className="table table-dark align-middle mb-0">
              <thead>
                <tr className="text-secondary small">
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((it) => (
                  <tr key={it.id} data-testid="cart-row">
                    <td className="fw-semibold">{it.nombre}</td>
                    <td>${Number(it.precio).toFixed(2)}</td>
                    <td>{it.cantidad || 1}</td>
                    <td className="fw-bold text-info">${(Number(it.precio) * (it.cantidad || 1)).toFixed(2)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        onClick={() => eliminar(it.id)}
                        className="btn btn-outline-danger btn-sm border-0"
                        aria-label="Eliminar del carrito"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold m-0" data-testid="cart-total">Total: ${total.toFixed(2)}</h4>
            <Link to="/checkout" className="btn btn-success btn-lg px-4 fw-bold">Proceder al Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}

export function Checkout() {
  const navigate = useNavigate();
  const carrito = JSON.parse(localStorage.getItem('nexus_carrito')) || [];
  const total = carrito.reduce((acc, it) => acc + Number(it.precio) * (it.cantidad || 1), 0);

  const [cliente, setCliente] = useState({
    nombre: 'Vicente',
    apellidos: 'González',
    correo: 'vicente@nexus.cl',
    calle: 'Av. Las Industrias 1234',
    departamento: 'Depto 402',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: 'Entregar en conserjería'
  });

  const handleChange = (e) => setCliente({ ...cliente, [e.target.name]: e.target.value });

  const procesar = (exito) => {
    if (exito) {
      const orden = dataStore.crearOrden({ cliente, items: carrito, total: total.toFixed(2) });
      localStorage.removeItem('nexus_carrito');
      window.dispatchEvent(new Event('nexus_sync'));
      navigate('/pago-correcto', { state: { orden } });
    } else {
      navigate('/pago-error', { state: { cliente, total: total.toFixed(2) } });
    }
  };

  return (
    <div className="container py-5 text-light" style={{ maxWidth: '850px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <h3 className="fw-bold m-0">Finalizar Compra (Checkout)</h3>
        <span className="badge bg-primary fs-6">Total: ${total.toFixed(2)}</span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label small text-secondary">Nombre *</label>
          <input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
        </div>
        <div className="col-md-6">
          <label className="form-label small text-secondary">Apellidos</label>
          <input type="text" name="apellidos" value={cliente.apellidos} onChange={handleChange} className="form-control bg-dark text-light border-secondary" />
        </div>
        <div className="col-12">
          <label className="form-label small text-secondary">Correo Electrónico *</label>
          <input type="email" name="correo" value={cliente.correo} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
        </div>
        <div className="col-md-8">
          <label className="form-label small text-secondary">Calle y Número *</label>
          <input type="text" name="calle" value={cliente.calle} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
        </div>
        <div className="col-md-4">
          <label className="form-label small text-secondary">Departamento (opcional)</label>
          <input type="text" name="departamento" value={cliente.departamento} onChange={handleChange} className="form-control bg-dark text-light border-secondary" />
        </div>
        <div className="col-md-6">
          <label className="form-label small text-secondary">Región</label>
          <select name="region" value={cliente.region} onChange={handleChange} className="form-select bg-dark text-light border-secondary">
            <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small text-secondary">Comuna</label>
          <select name="comuna" value={cliente.comuna} onChange={handleChange} className="form-select bg-dark text-light border-secondary">
            <option value="Cerrillos">Cerrillos</option>
            <option value="La Granja">La Granja</option>
            <option value="La Pintana">La Pintana</option>
            <option value="Santiago Centro">Santiago Centro</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary border-opacity-25">
        <button type="button" onClick={() => procesar(false)} className="btn btn-outline-danger px-4">Simular Fallo</button>
        <button type="button" onClick={() => procesar(true)} className="btn btn-success fw-bold px-4">Pagar ahora ${total.toFixed(2)}</button>
      </div>
    </div>
  );
}

export function PagoCorrecto() {
  const { state } = useLocation();
  const orden = state?.orden || { nroOrden: '#20240705', total: '50.99' };

  return (
    <div className="container py-5 text-light text-center" style={{ maxWidth: '650px' }}>
      <div className="p-5 bg-dark rounded-4 border border-success border-opacity-50 shadow-lg">
        <h2 className="fw-bold mt-3 mb-2">¡Compra Realizada con Éxito!</h2>
        <span className="badge bg-secondary fs-6 mb-3">Orden: {orden.nroOrden}</span>
        <h4 className="fw-bold text-success mb-4">Total Pagado: ${orden.total}</h4>
        <div className="d-flex justify-content-center gap-3">
          <Link to={`/boleta/${encodeURIComponent(orden.nroOrden)}`} className="btn btn-outline-info px-4 fw-bold rounded-pill">
            Ver Boleta Digital
          </Link>
          <Link to="/" className="btn btn-primary px-4 fw-bold rounded-pill">Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );
}

export function PagoError() {
  const navigate = useNavigate();
  return (
    <div className="container py-5 text-light text-center" style={{ maxWidth: '650px' }}>
      <div className="p-5 bg-dark rounded-4 border border-danger border-opacity-50 shadow-lg">
        <h2 className="fw-bold mt-3 mb-2">No se pudo realizar el pago</h2>
        <p className="text-secondary mb-4">La transacción fue rechazada o falló la verificación de seguridad.</p>
        <button onClick={() => navigate('/checkout')} className="btn btn-danger fw-bold px-4 rounded-pill me-2">VOLVER A INTENTAR</button>
        <Link to="/carrito" className="btn btn-outline-secondary px-4 rounded-pill">Ir al Carrito</Link>
      </div>
    </div>
  );
}

export function MostrarBoleta() {
  const { nroOrden } = useParams();
  const ordenes = dataStore.getOrdenes();
  const orden = ordenes.find((o) => o.nroOrden === decodeURIComponent(nroOrden || '')) || {
    nroOrden: nroOrden || '#20240705',
    fecha: '14-10-2026',
    total: '50.99',
    cliente: { nombre: 'Vicente', apellidos: 'González', correo: 'vicente@nexus.cl', calle: 'Av. Las Industrias 1234', comuna: 'Cerrillos' },
    items: [{ id: 4, nombre: 'God of War Ragnarök', precio: 50.99, cantidad: 1 }]
  };

  const { neto, iva, total } = dataStore.calcularDesgloseIVA(orden.total);

  return (
    <div className="container py-5 text-light" style={{ maxWidth: '750px' }}>
      <div className="p-4 p-md-5 bg-dark rounded-4 border border-secondary border-opacity-25 shadow-lg">
        <div className="d-flex justify-content-between align-items-start border-bottom border-secondary border-opacity-25 pb-3 mb-4">
          <div>
            <h3 className="fw-bold m-0 text-primary">Nexus Store SpA</h3>
            <small className="text-secondary">R.U.T.: 76.845.190-2 • Facturación Electrónica</small>
          </div>
          <div className="text-end">
            <span className="badge bg-danger fs-6 px-3 py-2">BOLETA ELECTRÓNICA</span>
            <div className="fw-bold mt-2 text-warning fs-5">{orden.nroOrden}</div>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-4">
          <div style={{ width: '260px' }}>
            <div className="d-flex justify-content-between small text-secondary py-1">
              <span>Monto Neto:</span>
              <span data-testid="boleta-neto">${neto.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small text-secondary py-1 border-bottom border-secondary border-opacity-25">
              <span>I.V.A. (19%):</span>
              <span data-testid="boleta-iva">${iva.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5 text-success py-2">
              <span>Total Pagado:</span>
              <span data-testid="boleta-total">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}