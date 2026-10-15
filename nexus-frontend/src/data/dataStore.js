const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: 'Grand Theft Auto VI',
    categoria: 'Mundo Abierto',
    precio: 99.99,
    stock: 15,
    oferta: false,
    descuento: 0,
    imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Explora el estado de Leonida y Vice City en el mundo abierto más ambicioso y detallado jamás creado.'
  },
  {
    id: 2,
    nombre: 'Cyberpunk 2077',
    categoria: 'Acción / RPG',
    precio: 44.99,
    stock: 3, // Stock crítico (<= 5)
    oferta: true,
    descuento: 15,
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    descripcion: 'RPG de acción y aventura en mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder.'
  },
  {
    id: 3,
    nombre: 'EA SPORTS FC 27',
    categoria: 'Deportes',
    precio: 80.99,
    stock: 20,
    oferta: false,
    descuento: 0,
    imagen: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Vive el fútbol mundial con tecnología HyperMotionV, ligas licenciadas y modos competitivos online.'
  },
  {
    id: 4,
    nombre: 'God of War Ragnarök',
    categoria: 'Aventura',
    precio: 50.99,
    stock: 2, // Stock crítico (<= 5)
    oferta: true,
    descuento: 20,
    imagen: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Kratos y Atreus deben viajar a cada uno de los Nueve Reinos en busca de respuestas antes del Ragnarök.'
  },
  {
    id: 5,
    nombre: 'Minecraft Java & Bedrock',
    categoria: 'Sandbox',
    precio: 26.95,
    stock: 30,
    oferta: true,
    descuento: 10,
    imagen: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Construye, explora y sobrevive en mundos infinitos generados proceduralmente junto a tus amigos.'
  },
  {
    id: 6,
    nombre: 'Elden Ring: Shadow of the Erdtree',
    categoria: 'Acción / RPG',
    precio: 59.99,
    stock: 4, // Stock crítico (<= 5)
    oferta: false,
    descuento: 0,
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Adéntrate en la Tierra Sombría y descubre nuevos jefes, armas y misterios en el galardonado RPG de FromSoftware.'
  }
];

const CATEGORIAS_INICIALES = [
  'Mundo Abierto',
  'Acción / RPG',
  'Deportes',
  'Aventura',
  'Sandbox'
];

export const dataStore = {
  getProductos() {
    const raw = localStorage.getItem('nexus_productos');
    if (!raw) {
      localStorage.setItem('nexus_productos', JSON.stringify(PRODUCTOS_INICIALES));
      return [...PRODUCTOS_INICIALES];
    }
    return JSON.parse(raw);
  },

  getProductoById(id) {
    const productos = this.getProductos();
    return productos.find(p => Number(p.id) === Number(id)) || null;
  },

  getProductosCriticos(umbral = 5) {
    return this.getProductos().filter(p => Number(p.stock) <= umbral);
  },

  crearProducto(nuevo) {
    const productos = this.getProductos();
    const id = productos.length > 0 ? Math.max(...productos.map(p => Number(p.id))) + 1 : 1;
    const item = {
      id,
      nombre: nuevo.nombre,
      categoria: nuevo.categoria || 'Acción / RPG',
      precio: Number(nuevo.precio),
      stock: Number(nuevo.stock ?? 10),
      oferta: Boolean(nuevo.oferta),
      descuento: Number(nuevo.descuento || 0),
      imagen: nuevo.imagen || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      descripcion: nuevo.descripcion || 'Licencia digital oficial con entrega inmediata.'
    };
    productos.push(item);
    localStorage.setItem('nexus_productos', JSON.stringify(productos));
    return item;
  },

  actualizarProducto(id, cambios) {
    const productos = this.getProductos();
    const idx = productos.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return null;
    productos[idx] = {
      ...productos[idx],
      ...cambios,
      id: Number(id),
      precio: Number(cambios.precio ?? productos[idx].precio),
      stock: Number(cambios.stock ?? productos[idx].stock)
    };
    localStorage.setItem('nexus_productos', JSON.stringify(productos));
    return productos[idx];
  },

  eliminarProducto(id) {
    const productos = this.getProductos().filter(p => Number(p.id) !== Number(id));
    localStorage.setItem('nexus_productos', JSON.stringify(productos));
    return productos;
  },

  getCategorias() {
    return [...CATEGORIAS_INICIALES];
  },

  getOrdenes() {
    const raw = localStorage.getItem('nexus_ordenes');
    return raw ? JSON.parse(raw) : [];
  },

  crearOrden(datosOrden) {
    const ordenes = this.getOrdenes();
    const nroOrden = `#${Math.floor(10000000 + Math.random() * 90000000)}`;
    const nuevaOrden = {
      nroOrden,
      fecha: new Date().toLocaleDateString('es-CL'),
      cliente: datosOrden.cliente,
      items: datosOrden.items || [],
      total: Number(datosOrden.total).toFixed(2),
      estado: 'Completado'
    };
    ordenes.unshift(nuevaOrden);
    localStorage.setItem('nexus_ordenes', JSON.stringify(ordenes));
    return nuevaOrden;
  },

  calcularDesgloseIVA(totalBruto) {
    const total = Number(totalBruto) || 0;
    const neto = Number((total / 1.19).toFixed(2));
    const iva = Number((total - neto).toFixed(2));
    return { neto, iva, total: Number(total.toFixed(2)) };
  }
};