export interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}
export interface Pessoa {
  id: number;
  nome: string;
  ativo: boolean;
  endereco: Endereco;
}
export interface Categoria {
  id: number;
  nome: string;
}
export interface Lancamento {
  id: number;
  descricao: string;
  tipo: "RECEITA" | "DESPESA";
  valor: number;
  dataVencimento: string;
  dataPagamento: string | null;
  observacao: string;
  pessoa: Pessoa;
  categoria: Categoria;
}
export type Tela = "Visão geral" | "Lançamentos" | "Pessoas" | "Categorias";
