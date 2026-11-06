export type TipoLancamento = 'RECEITA' | 'DESPESA';

export interface Endereco {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
}

export interface Categoria {
    id: string;
    nome: string;
}

export interface Pessoa {
    id: string;
    nome: string;
    ativo: boolean;
    endereco: Endereco;
}

export interface Lancamento {
    id: string;
    descricao: string;
    tipo: TipoLancamento;
    dataVencimento: string;
    dataPagamento?: string;
    valor: number;
    observacao?: string;
    categoriaId: string;
    pessoaId: string;
}