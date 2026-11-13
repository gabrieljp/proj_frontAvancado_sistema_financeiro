import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography, Paper, TextField, MenuItem, Button, Stack, Alert,
    CircularProgress, Box,
} from '@mui/material';
import {
    listarPessoas, listarCategorias, criarLancamento,
} from '../services/lancamentoService';
import type { Pessoa, Categoria, TipoLancamento } from '../types';

export default function LancamentoForm() {
    const navigate = useNavigate();

    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState<TipoLancamento>('DESPESA');
    const [valor, setValor] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [pessoaId, setPessoaId] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [observacao, setObservacao] = useState('');

    useEffect(() => {
        Promise.all([listarPessoas(), listarCategorias()])
            .then(([p, c]) => {
                setPessoas(p.filter((pessoa) => pessoa.ativo));
                setCategorias(c);
            })
            .catch(() => setErro('Não foi possível carregar pessoas e categorias.'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async () => {
        setErro(null);

        if (!descricao.trim() || !valor || !dataVencimento || !pessoaId || !categoriaId) {
            setErro('Preencha todos os campos obrigatórios.');
            return;
        }
        if (Number(valor) <= 0) {
            setErro('O valor deve ser maior que zero.');
            return;
        }

        setSalvando(true);
        try {
            await criarLancamento({
                descricao: descricao.trim(),
                tipo,
                valor: Number(valor),
                dataVencimento,
                dataPagamento: '',
                observacao,
                pessoaId,
                categoriaId,
            });
            navigate('/lancamentos');
        } catch {
            setErro('Não foi possível salvar o lançamento. Verifique se a API está rodando.');
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Novo lançamento</Typography>

            <Stack spacing={2}>
                {erro && <Alert severity="error">{erro}</Alert>}

                <TextField
                    label="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                />

                <TextField
                    select
                    label="Tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoLancamento)}
                >
                    <MenuItem value="RECEITA">Receita</MenuItem>
                    <MenuItem value="DESPESA">Despesa</MenuItem>
                </TextField>

                <TextField
                    label="Valor (R$)"
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                />

                <TextField
                    label="Data de vencimento"
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                />

                <TextField
                    select
                    label="Pessoa"
                    value={pessoaId}
                    onChange={(e) => setPessoaId(e.target.value)}
                    required
                >
                    {pessoas.map((p) => (
                        <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Categoria"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    required
                >
                    {categorias.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Observação"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    multiline
                    rows={3}
                />

                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                    <Button onClick={() => navigate('/lancamentos')}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={salvando}>
                        {salvando ? 'Salvando...' : 'Salvar'}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}