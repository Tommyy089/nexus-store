import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Categorias, DetalleProducto, Ofertas, Blog, Nosotros, Contacto } from './pages/CatalogoPages';
import { Carrito, Checkout, PagoCorrecto, PagoError, MostrarBoleta } from './pages/CompraPages';
import { Login, Registro } from './pages/AuthPages';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-black text-light d-flex flex-column">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pago-correcto" element={<PagoCorrecto />} />
            <Route path="/pago-error" element={<PagoError />} />
            <Route path="/boleta/:nroOrden" element={<MostrarBoleta />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <footer className="bg-black text-secondary py-3 border-top border-secondary border-opacity-25 text-center mt-auto">
          <small>© 2026 Nexus Store. Evaluación 2 Duoc UC.</small>
        </footer>
      </div>
    </BrowserRouter>
  );
}