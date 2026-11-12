package br.edu.financeiro.web;

import br.edu.financeiro.domain.*;
import br.edu.financeiro.repository.*;
import br.edu.financeiro.service.CadastroService;
import br.edu.financeiro.web.Dados.*;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CadastroController {
    private final PessoaRepository pessoas; private final CategoriaRepository categorias; private final CadastroService service;
    public CadastroController(PessoaRepository p, CategoriaRepository c, CadastroService s) { pessoas=p; categorias=c; service=s; }
    @GetMapping("/pessoas") public List<Pessoa> pessoas() { return pessoas.findAll(Sort.by("nome")); }
    @PostMapping("/pessoas") public ResponseEntity<Pessoa> criarPessoa(@Valid @RequestBody PessoaInput dto) {
        Pessoa p=service.salvarPessoa(null,dto); return ResponseEntity.created(URI.create("/pessoas/"+p.id)).body(p);
    }
    @GetMapping("/pessoas/{id}") public Pessoa pessoa(@PathVariable Long id) { return service.pessoa(id); }
    @PutMapping("/pessoas/{id}") public Pessoa editarPessoa(@PathVariable Long id,@Valid @RequestBody PessoaInput dto) { return service.salvarPessoa(id,dto); }
    @PatchMapping("/pessoas/{id}/ativo") public Pessoa ativo(@PathVariable Long id,@RequestParam boolean valor) { return service.ativar(id,valor); }
    @GetMapping("/categorias") public List<Categoria> categorias() { return categorias.findAll(Sort.by("nome")); }
    @GetMapping("/categorias/{id}") public Categoria categoria(@PathVariable Long id) { return service.categoria(id); }
    @PostMapping("/categorias") public ResponseEntity<Categoria> criarCategoria(@Valid @RequestBody CategoriaInput dto) {
        Categoria c=service.salvarCategoria(null,dto); return ResponseEntity.created(URI.create("/categorias/"+c.id)).body(c);
    }
    @PutMapping("/categorias/{id}") public Categoria editarCategoria(@PathVariable Long id,@Valid @RequestBody CategoriaInput dto) { return service.salvarCategoria(id,dto); }
    @DeleteMapping("/categorias/{id}") public ResponseEntity<Void> excluirCategoria(@PathVariable Long id) { service.excluirCategoria(id); return ResponseEntity.noContent().build(); }
}
