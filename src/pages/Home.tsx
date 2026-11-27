import { useEffect, useState } from 'react';
import { Typography, Alert, Stack, Box, CircularProgress } from '@mui/material';
import { listarLancamentos } from '../services/lancamentoService';
import { ResumoCard } from '../components/ResumoCard';
import type { Lancamento } from '../types';

export default function Home() {
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        listarLancamentos()
            .then(setLancamentos)
            .catch(() => setErro('Não foi possível carregar o resumo. Verifique se a API está rodando.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (erro) return <Alert severity="error">{erro}</Alert>;

    const receitas = lancamentos
        .filter((l) => l.tipo === 'RECEITA')
        .reduce((soma, l) => soma + l.valor, 0);
    const despesas = lancamentos
        .filter((l) => l.tipo === 'DESPESA')
        .reduce((soma, l) => soma + l.valor, 0);
    const saldo = receitas - despesas;

    return (
        <>
            <Typography variant="h4" gutterBottom>Resumo financeiro</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Visão geral de todos os lançamentos cadastrados.
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <ResumoCard titulo="Receitas" valor={receitas} cor="success.main" />
                <ResumoCard titulo="Despesas" valor={despesas} cor="error.main" />
                <ResumoCard titulo="Saldo" valor={saldo} cor={saldo >= 0 ? 'primary.main' : 'error.main'} />
            </Stack>
        </>
    );
}