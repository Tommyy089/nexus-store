package com.nexus.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final LicenciaRepository licenciaRepository;

    public PedidoController(PedidoRepository pedidoRepository, LicenciaRepository licenciaRepository) {
        this.pedidoRepository = pedidoRepository;
        this.licenciaRepository = licenciaRepository;
    }

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

        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setNombreCliente(nombreCliente);
        nuevoPedido.setMetodoPago(metodoPago);
        nuevoPedido.setTotal(total);
        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        String parte1 = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String parte2 = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String claveGenerada = "NX77-" + parte1 + "-" + parte2;

        Licencia nuevaLicencia = new Licencia();
        nuevaLicencia.setCliente(nombreCliente);
        nuevaLicencia.setJuegoTitulo(tituloJuego);
        nuevaLicencia.setClaveActivacion(claveGenerada);
        licenciaRepository.save(nuevaLicencia);

        return ResponseEntity.ok(pedidoGuardado);
    }
}