package com.nexus.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Método para buscar si un correo ya existe al registrarse
    Optional<Usuario> findByEmail(String email);
    
    // Método para validar el login
    Optional<Usuario> findByEmailAndPassword(String email, String password);
}