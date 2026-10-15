import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (correo && pass) {
      const nombreUsuario = correo.split('@')[0];
      localStorage.setItem('nexus_usuario', nombreUsuario);
      window.dispatchEvent(new Event('nexus_sync'));
      window.alert(`¡Bienvenido, ${nombreUsuario}!`);
      navigate('/');
    }
  };

  return (
    <div className="container py-5 text-light" style={{ maxWidth: '480px' }}>
      <div className="p-4 p-md-5 bg-dark rounded-4 border border-secondary border-opacity-25 shadow-lg">
        <h3 className="fw-bold text-center mb-4">Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small text-secondary">Correo Electrónico</label>
            <input type="email" className="form-control bg-black text-light border-secondary" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small text-secondary">Contraseña</label>
            <input type="password" className="form-control bg-black text-light border-secondary" value={pass} onChange={(e) => setPass(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold py-2 rounded-3 mb-3">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export function Registro() {
  const [datos, setDatos] = useState({ nombre: '', correo: '', pass: '', confirm: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegistro = (e) => {
    e.preventDefault();
    if (datos.pass !== datos.confirm) {
      setErrorMsg('Las contraseñas no coinciden.');
      window.alert('Las contraseñas no coinciden.');
      return;
    }
    setErrorMsg('');
    localStorage.setItem('nexus_usuario', datos.nombre);
    window.dispatchEvent(new Event('nexus_sync'));
    window.alert(`Cuenta creada exitosamente para ${datos.nombre}.`);
    navigate('/');
  };

  return (
    <div className="container py-5 text-light" style={{ maxWidth: '520px' }}>
      <div className="p-4 p-md-5 bg-dark rounded-4 border border-secondary border-opacity-25 shadow-lg">
        <h3 className="fw-bold text-center mb-4">Crear Cuenta</h3>
        {errorMsg && (
          <div className="alert alert-danger py-2" data-testid="registro-error">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleRegistro}>
          <div className="mb-3">
            <label className="form-label small text-secondary">Nombre de Usuario</label>
            <input
              type="text"
              aria-label="Nombre de Usuario"
              className="form-control bg-black text-light border-secondary"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small text-secondary">Correo Electrónico</label>
            <input
              type="email"
              aria-label="Correo Electrónico"
              className="form-control bg-black text-light border-secondary"
              value={datos.correo}
              onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
              required
            />
          </div>
          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label small text-secondary">Contraseña</label>
              <input
                type="password"
                aria-label="Contraseña"
                className="form-control bg-black text-light border-secondary"
                value={datos.pass}
                onChange={(e) => setDatos({ ...datos, pass: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small text-secondary">Confirmar</label>
              <input
                type="password"
                aria-label="Confirmar"
                className="form-control bg-black text-light border-secondary"
                value={datos.confirm}
                onChange={(e) => setDatos({ ...datos, confirm: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-3 mb-3">Registrarme</button>
        </form>
        <div className="text-center small text-secondary">
          ¿Ya tienes cuenta? <Link to="/login" className="text-info">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}