package br.edu.financeiro.domain;

import jakarta.persistence.*;

@Entity
public class Categoria {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, unique=true, length=100) public String nome;
}
