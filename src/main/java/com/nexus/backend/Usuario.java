package com.nexus.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "NEXUS_USUARIOS") // Cambio clave para evitar conflictos en Oracle
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String alias;
    
    @Column(unique = true) // El correo no se puede repetir
    private String email;
    
    private String password;
    private String region;

    // Constructores vacíos exigidos por JPA
    public Usuario() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
}