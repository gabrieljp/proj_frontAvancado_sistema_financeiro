package br.edu.financeiro.domain;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.*;

@Embeddable
public class Endereco {
    @NotBlank @Size(max=150) public String logradouro;
    @NotBlank @Size(max=20) public String numero;
    @Size(max=100) public String complemento;
    @NotBlank @Size(max=100) public String bairro;
    @NotBlank @Pattern(regexp="\\d{5}-?\\d{3}", message="CEP deve ter 8 dígitos") public String cep;
    @NotBlank @Size(max=100) public String cidade;
    @NotBlank @Pattern(regexp="AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO", message="UF inválida") public String estado;
}
