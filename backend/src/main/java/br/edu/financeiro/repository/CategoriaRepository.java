package br.edu.financeiro.repository;

import br.edu.financeiro.domain.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);
}
