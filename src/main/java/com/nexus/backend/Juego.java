package com.nexus.backend;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "JUEGOS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Juego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TITULO")
    private String titulo;

    @Column(name = "TIPO_JUEGO")
    private String tipoJuego;

    @Column(name = "CATEGORIA")
    private String categoria;

    @Column(name = "PRECIO")
    private Double precio;

    @Column(name = "DESCUENTO")
    private Double descuento;

    @Column(name = "IMAGEN_URL")
    private String imagenUrl;

    @Column(name = "DESCRIPCION")
    private String descripcion;
}