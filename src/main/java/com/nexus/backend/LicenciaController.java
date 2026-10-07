package com.nexus.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/licencias")
@CrossOrigin(origins = "*")
public class LicenciaController {

    private final LicenciaRepository licenciaRepository;

    public LicenciaController(LicenciaRepository licenciaRepository) {
        this.licenciaRepository = licenciaRepository;
    }

    // Obtener todas las licencias de la base de datos
    @GetMapping
    public List<Licencia> listarLicencias() {
        return licenciaRepository.findAll();
    }
}