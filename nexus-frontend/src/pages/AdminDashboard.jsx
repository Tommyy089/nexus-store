import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataStore } from '../data/dataStore';

export default function AdminDashboard() {
  const [productos, setProductos] = useState(dataStore.getProductos());
  const [editandoId, setEditandoId] = useState(null);
  const [soloCriticos, setSoloCriticos] = useState(false);
  const ordenes = dataStore.getOrdenes();
  const criticos = dataStore.getProductosCriticos(5);

  const [form, setForm] = useState({
    nombre: '',
    categoria: 'Acción / RPG',
    precio: '',
    stock: 10
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio) return;

    if (editandoId) {
      dataStore.actualizarProducto(editandoId, {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock, 10)
      });
      setEditandoId(null);
      window.alert('Producto actualizado correctamente.');
    } else {
      dataStore.crearProducto({
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock, 10)
      });
      window.alert('Producto añadido con persistencia.');
    }

    setProductos(dataStore.getProductos());
    setForm({ nombre: '', categoria: 'Acción / RPG', precio: '', stock: 10 });
  };

  const iniciarEdicion = (prod) => {
    setEditandoId(prod.id);
    setForm({
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
      stock: prod.stock ?? 10
    });
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar producto permanentemente?')) {
      dataStore.eliminarProducto(id);
      setProductos(dataStore.getProductos());
    }
  };

  const listaVisible = soloCriticos ? criticos : productos;

  return (
    <div className="container-fluid px-lg-5 py-5 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <div>
          <h2 className="fw-bold m-0">Dashboard de Administración</h2>
          <small className="text-secondary">Gestión CRUD, Boletas y Control de Stock Crítico</small>
        </div>
        <Link to="/" className="btn btn-outline-light btn-sm rounded-pill px-3">Ir a la Tienda</Link>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card bg-primary text-white p-4 h-100 shadow rounded-4">
            <h6>Compras / Órdenes</h6>
            <h1 className="fw-bold my-2">{ordenes.length}</h1>
            <small>Transacciones procesadas</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white p-4 h-100 shadow rounded-4">
            <h6>Productos en Catálogo</h6>
            <h1 className="fw-bold my-2">{productos.length}</h1>
            <small>Inventario total</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white p-4 h-100 shadow rounded-4">
            <h6>Productos Críticos (≤ 5)</h6>
            <h1 className="fw-bold my-2" data-testid="kpi-criticos">{criticos.length}</h1>
            <small>Requieren reposición</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark p-4 h-100 shadow rounded-4">
            <h6>Usuarios Activos</h6>
            <h1 className="fw-bold my-2">3</h1>
            <small>Administradores y clientes</small>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-4">
          <div className="card bg-dark text-light border-secondary border-opacity-25 p-4 rounded-4 shadow">
            <h5 className="fw-bold mb-3">
              {editandoId ? 'Editar Producto' : 'Registrar Nuevo Producto'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-secondary">Nombre</label>
                <input
                  type="text"
                  aria-label="Nombre del producto"
                  className="form-control bg-black text-light border-secondary"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Categoría</label>
                <select
                  className="form-select bg-black text-light border-secondary"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                >
                  {dataStore.getCategorias().map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-secondary">Precio (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    aria-label="Precio del producto"
                    className="form-control bg-black text-light border-secondary"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-secondary">Stock</label>
                  <input
                    type="number"
                    aria-label="Stock del producto"
                    className="form-control bg-black text-light border-secondary"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">
                {editandoId ? 'Actualizar Producto' : 'Guardar en CRUD'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card bg-dark text-light border-secondary border-opacity-25 p-4 rounded-4 shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Inventario de Productos</h5>
              <button
                type="button"
                onClick={() => setSoloCriticos(!soloCriticos)}
                className={`btn btn-sm rounded-pill px-3 ${soloCriticos ? 'btn-danger' : 'btn-outline-warning'}`}
              >
                {soloCriticos ? 'Mostrar Todos' : `Ver Stock Crítico (${criticos.length})`}
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaVisible.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-semibold">{p.nombre}</td>
                      <td><span className="badge bg-secondary bg-opacity-25">{p.categoria}</span></td>
                      <td>
                        <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                          {p.stock} u.
                        </span>
                      </td>
                      <td className="text-info fw-bold">${Number(p.precio).toFixed(2)}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(p)}
                          className="btn btn-outline-info btn-sm me-2"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(p.id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}