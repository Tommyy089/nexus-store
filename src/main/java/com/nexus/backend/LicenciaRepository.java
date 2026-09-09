package com.nexus.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LicenciaRepository extends JpaRepository<Licencia, Long> {
    List<Licencia> findByCliente(String cliente);
}