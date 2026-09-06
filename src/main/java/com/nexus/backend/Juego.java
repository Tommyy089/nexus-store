package com.nexus.backend;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "juegos")
public class Juego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_juego")
    private Long id;

    private String titulo;
    private String descripcion;
    private Double precio;
    private Integer descuento;
    private String categoria;

    @Column(name = "tipo_juego")
    private String tipoJuego;

    @Column(name = "imagen_url")
    private String imagenUrl;
}