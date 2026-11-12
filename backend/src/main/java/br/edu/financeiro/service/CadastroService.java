package br.edu.financeiro.service;

import br.edu.financeiro.domain.*;
import br.edu.financeiro.repository.*;
import br.edu.financeiro.web.Dados.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.*;

@Service
@Transactional
public class CadastroService {
    private final PessoaRepository pessoas;
    private final CategoriaRepository categorias;
    private final LancamentoRepository lancamentos;
    public CadastroService(PessoaRepository p, CategoriaRepository c, LancamentoRepository l) { pessoas=p; categorias=c; lancamentos=l; }
    public Pessoa pessoa(Long id) { return pessoas.findById(id).orElseThrow(()->new ResponseStatusException(NOT_FOUND,"Pessoa não encontrada.")); }
    public Categoria categoria(Long id) { return categorias.findById(id).orElseThrow(()->new ResponseStatusException(NOT_FOUND,"Categoria não encontrada.")); }
    public Pessoa salvarPessoa(Long id, PessoaInput dto) {
        Pessoa p = id == null ? new Pessoa() : pessoa(id);
        p.nome=dto.nome().trim(); p.ativo=dto.ativo(); p.endereco=dto.endereco();
        return pessoas.save(p);
    }
    public Pessoa ativar(Long id, boolean ativo) { Pessoa p=pessoa(id); p.ativo=ativo; return pessoas.save(p); }
    public Categoria salvarCategoria(Long id, CategoriaInput dto) {
        String nome=dto.nome().trim();
        if(categorias.existsByNomeIgnoreCaseAndIdNot(nome, id == null ? 0L : id))
            throw new ResponseStatusException(CONFLICT,"Já existe uma categoria com esse nome.");
        Categoria c=id == null ? new Categoria() : categoria(id); c.nome=nome; return categorias.save(c);
    }
    public void excluirCategoria(Long id) {
        Categoria c=categoria(id);
        if(lancamentos.existsByCategoriaId(id)) throw new ResponseStatusException(CONFLICT,"Categoria vinculada a lançamentos não pode ser excluída.");
        categorias.delete(c);
    }
}
