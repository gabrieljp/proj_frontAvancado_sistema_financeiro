package br.edu.financeiro.web;

import br.edu.financeiro.domain.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public final class Dados {
    private Dados() {}
    public record PessoaInput(@NotBlank @Size(max=150) String nome, @NotNull Boolean ativo, @NotNull @Valid Endereco endereco) {}
    public record CategoriaInput(@NotBlank @Size(max=100) String nome) {}
    public record LancamentoInput(
        @NotBlank @Size(max=150) String descricao,
        @NotNull LocalDate dataVencimento,
        @PastOrPresent LocalDate dataPagamento,
        @NotNull @DecimalMin("0.01") @Digits(integer=13, fraction=2) BigDecimal valor,
        @Size(max=1000) String observacao,
        @NotNull TipoLancamento tipo,
        @NotNull @Positive Long pessoaId,
        @NotNull @Positive Long categoriaId) {}
}
