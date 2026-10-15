// =============================================================================
// DATASTORE.JS: Persistencia simulada en JavaScript (CRUD) para Nexus Store
// =============================================================================

const CATALOGO_INICIAL = [
  { id: 1, nombre: 'Grand Theft Auto VI', categoria: 'Mundo Abierto', precio: 99.99, stock: 15, imagen: 'grandTheftAuto6Banner.jpg', oferta: true, descuento: 10 },
  { id: 2, nombre: 'Cyberpunk 2077', categoria: 'Acción / RPG', precio: 44.99, stock: 28, imagen: 'CyberPunk.avif', oferta: true, descuento: 15 },
  { id: 3, nombre: 'EA SPORTS FC 27', categoria: 'Deportes', precio: 80.99, stock: 40, imagen: 'football.png', oferta: false, descuento: 0 },
  { id: 4, nombre: 'God of War Ragnarök', categoria: 'Aventura', precio: 50.99, stock: 12, imagen: 'god.avif', oferta: true, descuento: 20 },
  { id: 5, nombre: 'Minecraft', categoria: 'Aventura / Sandbox', precio: 26.95, stock: 50, imagen: 'minecraft.jpg', oferta: false, descuento: 0 },
  { id: 6, nombre: 'Red Dead Redemption 2', categoria: 'Mundo Abierto', precio: 59.99, stock: 8, imagen: 'redDead.jpg', oferta: true, descuento: 25 }
];

const CATEGORIAS_INICIALES = ['Acción / RPG', 'Mundo Abierto', 'Deportes', 'Aventura / Sandbox', 'Suscripciones'];

const initStorage = () => {
  if (!localStorage.getItem('nexus_productos')) {
    localStorage.setItem('nexus_productos', JSON.stringify(CATALOGO_INICIAL));
  }
  if (!localStorage.getItem('nexus_categorias')) {
    localStorage.setItem('nexus_categorias', JSON.stringify(CATEGORIAS_INICIALES));
  }
  if (!localStorage.getItem('nexus_ordenes')) {
    localStorage.setItem('nexus_ordenes', JSON.stringify([]));
  }
};

initStorage();

export const dataStore = {
  // --- CRUD PRODUCTOS ---
  getProductos: () => JSON.parse(localStorage.getItem('nexus_productos')) || [],
  
  getProductoById: (id) => {
    const prods = dataStore.getProductos();
    return prods.find(p => p.id === Number(id));
  },

  crearProducto: (producto) => {
    const prods = dataStore.getProductos();
    const nuevo = { ...producto, id: Date.now() };
    prods.push(nuevo);
    localStorage.setItem('nexus_productos', JSON.stringify(prods));
    return nuevo;
  },

  actualizarProducto: (id, dataActualizada) => {
    const prods = dataStore.getProductos();
    const index = prods.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      prods[index] = { ...prods[index], ...dataActualizada };
      localStorage.setItem('nexus_productos', JSON.stringify(prods));
      return prods[index];
    }
    return null;
  },

  eliminarProducto: (id) => {
    const prods = dataStore.getProductos().filter(p => p.id !== Number(id));
    localStorage.setItem('nexus_productos', JSON.stringify(prods));
    return true;
  },

  // --- CRUD CATEGORÍAS ---
  getCategorias: () => JSON.parse(localStorage.getItem('nexus_categorias')) || [],
  
  crearCategoria: (categoria) => {
    const cats = dataStore.getCategorias();
    if (!cats.includes(categoria)) {
      cats.push(categoria);
      localStorage.setItem('nexus_categorias', JSON.stringify(cats));
    }
    return cats;
  },

  // --- CRUD ÓRDENES / BOLETAS ---
  getOrdenes: () => JSON.parse(localStorage.getItem('nexus_ordenes')) || [],

  crearOrden: (orden) => {
    const ordenes = dataStore.getOrdenes();
    const nuevaOrden = {
      ...orden,
      nroOrden: `#${Date.now().toString().slice(-8)}`,
      fecha: new Date().toLocaleDateString('es-CL'),
      estado: 'Completado'
    };
    ordenes.push(nuevaOrden);
    localStorage.setItem('nexus_ordenes', JSON.stringify(ordenes));
    return nuevaOrden;
  }
};