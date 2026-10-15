import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { dataStore } from '../data/dataStore';
import ProductCard from '../components/ProductCard';
import Home from '../pages/Home';
import { Carrito, MostrarBoleta } from '../pages/CompraPages';
import { Registro } from '../pages/AuthPages';
import AdminDashboard from '../pages/AdminDashboard';

describe('Suite de 10 Pruebas Unitarias Reales - Nexus Store (Jasmine + Karma)', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // 1. PRUEBA DE LISTA / RENDERIZADO DE COLECCIÓN
  it('TC-01 [Renderizado de Lista]: Home renderiza la lista completa de productos desde dataStore', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const tarjetas = screen.getAllByTestId('product-card');
    expect(tarjetas.length).toBe(6);
  });

  // 2. PRUEBA DE RENDERIZADO CONDICIONAL (Oferta y Stock Crítico)
  it('TC-02 [Renderizado Condicional]: ProductCard muestra el badge de oferta y stock crítico solo cuando corresponde', () => {
    const prodCriticoEnOferta = {
      id: 99,
      nombre: 'Silent Hill 2 Remake',
      categoria: 'Terror',
      precio: 49.99,
      stock: 3,
      oferta: true,
      descuento: 25,
      imagen: 'test.jpg'
    };

    render(
      <MemoryRouter>
        <ProductCard producto={prodCriticoEnOferta} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('badge-oferta').textContent).toContain('-25% OFERTA');
    expect(screen.getByTestId('badge-critico').textContent).toContain('¡Últimas 3 unidades!');
  });

  // 3. PRUEBA DE PROPIEDADES (PROPS) Y MOCK CON JASMINE.CREATESPY
  it('TC-03 [Props y Mock Spy]: ProductCard recibe props correctamente y ejecuta el callback onAddToCart (jasmine.createSpy)', () => {
    const mockAddToCart = jasmine.createSpy('onAddToCartSpy');
    const prod = { id: 10, nombre: 'Halo Infinite', categoria: 'Shooter', precio: 39.99, stock: 10, imagen: 'img.jpg' };

    render(
      <MemoryRouter>
        <ProductCard producto={prod} onAddToCart={mockAddToCart} />
      </MemoryRouter>
    );

    const boton = screen.getByText('Añadir al Carrito');
    fireEvent.click(boton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(prod);
  });

  // 4. PRUEBA DE CRUD EN DATASTORE (CREAR Y ACTUALIZAR PRODUCTO CON SPY EN LOCALSTORAGE)
  it('TC-04 [CRUD Crear y Editar]: dataStore.crearProducto y actualizarProducto persisten cambios en localStorage', () => {
    spyOn(localStorage, 'setItem').and.callThrough();

    const creado = dataStore.crearProducto({ nombre: 'Starfield', categoria: 'RPG', precio: 59.99, stock: 8 });
    expect(creado.nombre).toBe('Starfield');
    expect(localStorage.setItem).toHaveBeenCalled();

    const actualizado = dataStore.actualizarProducto(creado.id, { precio: 29.99, stock: 2 });
    expect(actualizado.precio).toBe(29.99);
    expect(actualizado.stock).toBe(2);
  });

  // 5. PRUEBA DE PRODUCTOS CRÍTICOS Y ELIMINACIÓN EN DATASTORE
  it('TC-05 [CRUD Eliminar y Stock Crítico]: dataStore filtra productos con stock <= 5 y permite eliminarlos', () => {
    const criticosIniciales = dataStore.getProductosCriticos(5);
    expect(criticosIniciales.length).toBe(3);

    dataStore.eliminarProducto(2);
    const criticosTrasEliminar = dataStore.getProductosCriticos(5);
    expect(criticosTrasEliminar.length).toBe(2);
  });

  // 6. PRUEBA DE CREACIÓN DE ORDEN Y DESGLOSE DE BOLETA CON IVA (19%)
  it('TC-06 [Boleta e IVA]: dataStore.crearOrden genera número de orden y MostrarBoleta calcula Neto e IVA (19%)', () => {
    const orden = dataStore.crearOrden({
      cliente: { nombre: 'Tomás', apellidos: 'Cerpa', correo: 'tomas@duocuc.cl' },
      items: [{ id: 1, nombre: 'GTA VI', precio: 119.00, cantidad: 1 }],
      total: 119.00
    });

    expect(orden.nroOrden).toMatch(/^#\d+/);

    render(
      <MemoryRouter initialEntries={[`/boleta/${encodeURIComponent(orden.nroOrden)}`]}>
        <Routes>
          <Route path="/boleta/:nroOrden" element={<MostrarBoleta />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('boleta-neto').textContent).toBe('$100.00');
    expect(screen.getByTestId('boleta-iva').textContent).toBe('$19.00');
    expect(screen.getByTestId('boleta-total').textContent).toBe('$119.00');
  });

  // 7. PRUEBA DE CARRITO Y MOCK DE WINDOW.CONFIRM
  it('TC-07 [Eventos y Mock window.confirm]: Carrito calcula el total y elimina un ítem al confirmar en window.confirm', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    localStorage.setItem('nexus_carrito', JSON.stringify([
      { id: 1, nombre: 'GTA VI', precio: 50.00, cantidad: 2 }
    ]));

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByTestId('cart-total').textContent).toBe('Total: $100.00');

    const btnEliminar = screen.getByLabelText('Eliminar del carrito');
    fireEvent.click(btnEliminar);

    expect(window.confirm).toHaveBeenCalledWith('¿Deseas eliminar este producto del carrito?');
    expect(screen.getByText('El carrito está vacío')).toBeTruthy();
  });

  // 8. PRUEBA DE ESTADO Y VALIDACIÓN EN REGISTRO CON MOCK DE WINDOW.ALERT
  it('TC-08 [Estado y Mock window.alert]: Registro bloquea contraseñas distintas y dispara alerta y mensaje de error', () => {
    spyOn(window, 'alert');

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre de Usuario'), { target: { value: 'tomas_cerpa' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'tomas@duoc.cl' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Confirmar'), { target: { value: '999999' } });

    fireEvent.click(screen.getByText('Registrarme'));

    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden.');
    expect(screen.getByTestId('registro-error').textContent).toContain('Las contraseñas no coinciden.');
  });

  // 9. PRUEBA DE CREACIÓN DE PRODUCTO DESDE EL FORMULARIO DEL ADMIN DASHBOARD
  it('TC-09 [Estado y Formulario Admin]: AdminDashboard permite crear un nuevo producto actualizando la tabla y llamando a window.alert', () => {
    spyOn(window, 'alert');

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre del producto'), { target: { value: 'Red Dead Redemption 2' } });
    fireEvent.change(screen.getByLabelText('Precio del producto'), { target: { value: '45.50' } });
    fireEvent.change(screen.getByLabelText('Stock del producto'), { target: { value: '12' } });

    fireEvent.click(screen.getByText('Guardar en CRUD'));

    expect(window.alert).toHaveBeenCalledWith('Producto añadido con persistencia.');
    expect(screen.getByText('Red Dead Redemption 2')).toBeTruthy();
  });

  // 10. PRUEBA DE FILTRO DE PRODUCTOS CRÍTICOS EN ADMIN DASHBOARD
  it('TC-10 [Eventos e Interactividad Admin]: AdminDashboard muestra KPI de productos críticos y filtra la tabla al hacer clic', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId('kpi-criticos').textContent).toBe('3');

    const btnFiltroCritico = screen.getByText(/Ver Stock Crítico/i);
    fireEvent.click(btnFiltroCritico);

    expect(screen.getByText('Mostrar Todos')).toBeTruthy();
  });
});