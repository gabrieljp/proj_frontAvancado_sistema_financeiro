package br.edu.financeiro.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Lancamento {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, length=150) public String descricao;
    @Column(nullable=false) public LocalDate dataVencimento;
    public LocalDate dataPagamento;
    @Column(nullable=false, precision=15, scale=2) public BigDecimal valor;
    @Column(length=1000) public String observacao;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public TipoLancamento tipo;
    @ManyToOne(optional=false) @JoinColumn(nullable=false) public Pessoa pessoa;
    @ManyToOne(optional=false) @JoinColumn(nullable=false) public Categoria categoria;
}
