package com.nexus.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario nuevoUsuario) {
        if (usuarioRepository.findByEmail(nuevoUsuario.getEmail()).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Este correo ya está registrado.");
            return ResponseEntity.badRequest().body(error);
        }
        
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok(usuarioGuardado);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario credenciales) {
        Optional<Usuario> usuarioBD = usuarioRepository.findByEmailAndPassword(credenciales.getEmail(), credenciales.getPassword());
        
        if (usuarioBD.isPresent()) {
            return ResponseEntity.ok(usuarioBD.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Correo o contraseña incorrectos.");
            return ResponseEntity.status(401).body(error);
        }
    }
}