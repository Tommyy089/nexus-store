package com.nexus.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; // ¡Esta es la importación nueva!
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private LicenciaRepository licenciaRepository;

    // NUEVO: Este es el método que soluciona el error en tu cuenta.html
    @GetMapping
    public List<Pedido> obtenerHistorial() {
        return pedidoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody Map<String, Object> payload) {
        
        // 1. Extraer los datos que envía el frontend
        String nombreCliente = payload.get("nombreCliente").toString();
        String metodoPago = payload.get("metodoPago").toString();
        Double total = Double.valueOf(payload.get("total").toString());
        String tituloJuego = payload.getOrDefault("juegoTitulo", "Juego Desconocido").toString();

        // 2. Guardar el Pedido normal en Oracle
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setNombreCliente(nombreCliente);
        nuevoPedido.setMetodoPago(metodoPago);
        nuevoPedido.setTotal(total);
        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // 3. Generar una clave única (Ej: NX77-A1B2-C3D4)
        String parte1 = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String parte2 = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String claveGenerada = "NX77-" + parte1 + "-" + parte2;

        // 4. Guardar la Licencia asociada a ese cliente y juego
        Licencia nuevaLicencia = new Licencia();
        nuevaLicencia.setCliente(nombreCliente);
        nuevaLicencia.setJuegoTitulo(tituloJuego);
        nuevaLicencia.setClaveActivacion(claveGenerada);
        licenciaRepository.save(nuevaLicencia);

        // Devolver el pedido al frontend (con status 200 OK)
        return ResponseEntity.ok(pedidoGuardado);
    }
}