import { api } from './api';
import type { Pessoa } from '../types';

export type DadosPessoa = Omit<Pessoa, 'id'>;

export const listarPessoas = (signal?: AbortSignal) =>
    api.get<Pessoa[]>('/pessoas', { signal }).then((resposta) => resposta.data);

export const criarPessoa = (dados: DadosPessoa) =>
    api.post<Pessoa>('/pessoas', dados).then((resposta) => resposta.data);

export const atualizarPessoa = (id: string, dados: DadosPessoa) =>
    api
        .put<Pessoa>(`/pessoas/${encodeURIComponent(id)}`, dados)
        .then((resposta) => resposta.data);

export const alterarSituacaoPessoa = (id: string, ativo: boolean) =>
    api
        .patch<Pessoa>(`/pessoas/${encodeURIComponent(id)}`, { ativo })
        .then((resposta) => resposta.data);
