package com.nexus.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/juegos")
@CrossOrigin(origins = "*")
public class JuegoController {

    private final JuegoRepository juegoRepository;

    public JuegoController(JuegoRepository juegoRepository) {
        this.juegoRepository = juegoRepository;
    }

    @GetMapping
    public List<Juego> listarJuegos() {
        return juegoRepository.findAll();
    }

    // Obtener por ID único
    @GetMapping("/{id}")
    public Juego obtenerPorId(@PathVariable Long id) {
        return juegoRepository.findById(id).orElse(null);
    }

    // NUEVO: Buscar por título (?q=...)
    @GetMapping("/buscar")
    public List<Juego> buscarPorTitulo(@RequestParam("q") String titulo) {
        return juegoRepository.findByTituloContainingIgnoreCase(titulo);
    }

    // NUEVO: Filtrar por categoría (?cat=...)
    @GetMapping("/categoria/{cat}")
    public List<Juego> filtrarPorCategoria(@PathVariable String cat) {
        if (cat.equalsIgnoreCase("Todos")) {
            return juegoRepository.findAll();
        }
        return juegoRepository.findByCategoriaContainingIgnoreCase(cat);
    }
}