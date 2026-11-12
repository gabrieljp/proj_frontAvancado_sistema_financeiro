package br.edu.financeiro.service;

import br.edu.financeiro.domain.*;
import br.edu.financeiro.repository.*;
import br.edu.financeiro.web.Dados.LancamentoInput;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.*;

@Service
@Transactional
public class LancamentoService {
    private final LancamentoRepository repository;
    private final CadastroService cadastros;
    public LancamentoService(LancamentoRepository r, CadastroService c) { repository=r; cadastros=c; }
    public Lancamento buscar(Long id) { return repository.findById(id).orElseThrow(()->new ResponseStatusException(NOT_FOUND,"Lançamento não encontrado.")); }
    public Lancamento salvar(Long id, LancamentoInput dto) {
        Pessoa pessoa=cadastros.pessoa(dto.pessoaId());
        if(!pessoa.ativo) throw new ResponseStatusException(UNPROCESSABLE_ENTITY,"A pessoa vinculada deve estar ativa.");
        Categoria categoria=cadastros.categoria(dto.categoriaId());
        Lancamento l=id == null ? new Lancamento() : buscar(id);
        l.descricao=dto.descricao().trim(); l.valor=dto.valor(); l.tipo=dto.tipo();
        l.dataVencimento=dto.dataVencimento(); l.dataPagamento=dto.dataPagamento();
        l.observacao=dto.observacao(); l.pessoa=pessoa; l.categoria=categoria;
        return repository.save(l);
    }
    @Transactional(readOnly=true)
    public List<Lancamento> consultar(LocalDate inicio, LocalDate fim, Long pessoaId, Long categoriaId, TipoLancamento tipo) {
        if(inicio != null && fim != null && inicio.isAfter(fim)) throw new ResponseStatusException(BAD_REQUEST,"Data inicial deve ser anterior ou igual à final.");
        Specification<Lancamento> spec=(root, query, cb)->cb.conjunction();
        if(inicio != null) spec=spec.and((r,q,c)->c.greaterThanOrEqualTo(r.get("dataVencimento"),inicio));
        if(fim != null) spec=spec.and((r,q,c)->c.lessThanOrEqualTo(r.get("dataVencimento"),fim));
        if(pessoaId != null) spec=spec.and((r,q,c)->c.equal(r.get("pessoa").get("id"),pessoaId));
        if(categoriaId != null) spec=spec.and((r,q,c)->c.equal(r.get("categoria").get("id"),categoriaId));
        if(tipo != null) spec=spec.and((r,q,c)->c.equal(r.get("tipo"),tipo));
        return repository.findAll(spec,Sort.by(Sort.Order.desc("dataVencimento"),Sort.Order.desc("id")));
    }
    public void excluir(Long id) { repository.delete(buscar(id)); }
}
