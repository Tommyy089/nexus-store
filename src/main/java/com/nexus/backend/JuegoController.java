package com.nexus.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;

interface JuegoRepository extends JpaRepository<Juego, Long> {}
interface PedidoRepository extends JpaRepository<Pedido, Long> {}

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JuegoController {

    private final JuegoRepository juegoRepository;
    private final PedidoRepository pedidoRepository;

    @GetMapping("/juegos")
    public List<Juego> listarJuegos() {
        return juegoRepository.findAll();
    }

    @GetMapping("/juegos/{id}")
    public ResponseEntity<Juego> obtenerPorId(@PathVariable Long id) {
        return juegoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/pedidos")
    public ResponseEntity<Pedido> registrarPedido(@RequestBody Pedido pedido) {
        Pedido nuevo = pedidoRepository.save(pedido);
        return ResponseEntity.ok(nuevo);
    }

    @GetMapping("/pedidos")
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }
}