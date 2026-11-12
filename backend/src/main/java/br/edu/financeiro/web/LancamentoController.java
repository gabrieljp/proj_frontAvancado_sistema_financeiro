package br.edu.financeiro.web;

import br.edu.financeiro.domain.*;
import br.edu.financeiro.service.LancamentoService;
import br.edu.financeiro.web.Dados.LancamentoInput;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lancamentos")
public class LancamentoController {
    private final LancamentoService service;
    public LancamentoController(LancamentoService s) { service=s; }
    @GetMapping public List<Lancamento> consultar(@RequestParam(required=false) LocalDate inicio,@RequestParam(required=false) LocalDate fim,
        @RequestParam(required=false) Long pessoaId,@RequestParam(required=false) Long categoriaId,@RequestParam(required=false) TipoLancamento tipo) {
        return service.consultar(inicio,fim,pessoaId,categoriaId,tipo);
    }
    @GetMapping("/{id}") public Lancamento buscar(@PathVariable Long id) { return service.buscar(id); }
    @PostMapping public ResponseEntity<Lancamento> criar(@Valid @RequestBody LancamentoInput dto) {
        Lancamento l=service.salvar(null,dto); return ResponseEntity.created(URI.create("/lancamentos/"+l.id)).body(l);
    }
    @PutMapping("/{id}") public Lancamento editar(@PathVariable Long id,@Valid @RequestBody LancamentoInput dto) { return service.salvar(id,dto); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Long id) { service.excluir(id); return ResponseEntity.noContent().build(); }
}
