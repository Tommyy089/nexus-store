package com.nexus.backend;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "LICENCIAS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Licencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "JUEGO_TITULO")
    private String juegoTitulo;

    @Column(name = "CLAVE_ACTIVACION")
    private String claveActivacion;

    @Column(name = "CLIENTE")
    private String cliente;
}