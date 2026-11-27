import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Typography, Paper, Stack, Button, Chip,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import {
    buscarLancamento, excluirLancamento, listarPessoas, listarCategorias,
} from '../services/lancamentoService';
import type { Lancamento, Pessoa, Categoria } from '../types';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export default function LancamentoDetalhe() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [lancamento, setLancamento] = useState<Lancamento | null>(null);
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [confirmando, setConfirmando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([buscarLancamento(id), listarPessoas(), listarCategorias()])
            .then(([l, p, c]) => {
                setLancamento(l);
                setPessoas(p);
                setCategorias(c);
            })
            .catch(() => setErro('Lançamento não encontrado ou API indisponível.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleExcluir = async () => {
        if (!id) return;
        setExcluindo(true);
        try {
            await excluirLancamento(id);
            navigate('/lancamentos');
        } catch {
            setConfirmando(false);
            setErro('Não foi possível excluir o lançamento.');
        } finally {
            setExcluindo(false);
        }
    };

    if (loading) return <LoadingState />;

    if (erro || !lancamento) {
        return (
            <ErrorState
                mensagem={erro ?? 'Lançamento não encontrado.'}
                onVoltar={() => navigate('/lancamentos')}
            />
        );
    }

    const pessoa = pessoas.find((p) => p.id === lancamento.pessoaId)?.nome ?? '—';
    const categoria = categorias.find((c) => c.id === lancamento.categoriaId)?.nome ?? '—';
    const formatarData = (d?: string) =>
        d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não pago';

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">{lancamento.descricao}</Typography>
                <Chip
                    label={lancamento.tipo}
                    color={lancamento.tipo === 'RECEITA' ? 'success' : 'error'}
                />
            </Stack>

            <Stack spacing={1.5}>
                <Typography variant="h5">
                    {lancamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Typography>
                <Typography><strong>Pessoa:</strong> {pessoa}</Typography>
                <Typography><strong>Categoria:</strong> {categoria}</Typography>
                <Typography><strong>Vencimento:</strong> {formatarData(lancamento.dataVencimento)}</Typography>
                <Typography><strong>Pagamento:</strong> {formatarData(lancamento.dataPagamento)}</Typography>
                <Typography><strong>Observação:</strong> {lancamento.observacao || '—'}</Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 4 }}>
                <Button onClick={() => navigate('/lancamentos')}>Voltar</Button>
                <Button variant="contained" color="error" onClick={() => setConfirmando(true)}>
                    Excluir
                </Button>
            </Stack>

            <Dialog open={confirmando} onClose={() => setConfirmando(false)}>
                <DialogTitle>Excluir lançamento?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Esta ação não pode ser desfeita.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmando(false)}>Cancelar</Button>
                    <Button color="error" onClick={handleExcluir} disabled={excluindo}>
                        {excluindo ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}