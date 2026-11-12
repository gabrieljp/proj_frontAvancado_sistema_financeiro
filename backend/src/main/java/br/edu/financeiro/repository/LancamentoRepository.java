package br.edu.financeiro.repository;

import br.edu.financeiro.domain.Lancamento;
import org.springframework.data.jpa.repository.*;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long>, JpaSpecificationExecutor<Lancamento> {
    boolean existsByCategoriaId(Long id);
}
