package br.edu.financeiro.domain;

import jakarta.persistence.*;

@Entity
public class Pessoa {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, length=150) public String nome;
    @Column(nullable=false) public boolean ativo;
    @Embedded public Endereco endereco;
}
