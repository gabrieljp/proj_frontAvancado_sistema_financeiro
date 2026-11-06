import { api } from './api';
import type { Lancamento, Pessoa, Categoria } from '../types';

export const listarLancamentos = () =>
    api.get<Lancamento[]>('/lancamentos').then((r) => r.data);

export const listarPessoas = () =>
    api.get<Pessoa[]>('/pessoas').then((r) => r.data);

export const listarCategorias = () =>
    api.get<Categoria[]>('/categorias').then((r) => r.data);