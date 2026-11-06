import { useEffect, useState } from 'react';
import {
    Typography, CircularProgress, Alert, Table, TableHead, TableRow,
    TableCell, TableBody, Paper, Chip, Box, TableContainer,
} from '@mui/material';
import {
    listarLancamentos, listarPessoas, listarCategorias,
} from '../services/lancamentoService';
import type { Lancamento, Pessoa, Categoria } from '../types';

export default function Lancamentos() {
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([listarLancamentos(), listarPessoas(), listarCategorias()])
            .then(([l, p, c]) => {
                setLancamentos(l);
                setPessoas(p);
                setCategorias(c);
            })
            .catch(() => setErro('Não foi possível carregar os lançamentos. Verifique se a API está rodando.'))
            .finally(() => setLoading(false));
    }, []);

    const nomePessoa = (id: string) => pessoas.find((p) => p.id === id)?.nome ?? '—';
    const nomeCategoria = (id: string) => categorias.find((c) => c.id === id)?.nome ?? '—';

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (erro) return <Alert severity="error">{erro}</Alert>;

    return (
        <>
            <Typography variant="h4" gutterBottom>Lançamentos</Typography>

            {lancamentos.length === 0 ? (
                <Alert severity="info">Nenhum lançamento cadastrado.</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Pessoa</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Vencimento</TableCell>
                                <TableCell align="right">Valor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lancamentos.map((l) => (
                                <TableRow key={l.id} hover>
                                    <TableCell>{l.descricao}</TableCell>
                                    <TableCell>{nomePessoa(l.pessoaId)}</TableCell>
                                    <TableCell>{nomeCategoria(l.categoriaId)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={l.tipo}
                                            color={l.tipo === 'RECEITA' ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(l.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell align="right">
                                        {l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}