import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import PessoaForm from '../components/PessoaForm';
import {
    alterarSituacaoPessoa,
    atualizarPessoa,
    criarPessoa,
    listarPessoas,
} from '../services/pessoaService';
import type { DadosPessoa } from '../services/pessoaService';
import type { Pessoa } from '../types';

const normalizar = (texto: string) =>
    texto
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase('pt-BR');

export default function Pessoas() {
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [loading, setLoading] = useState(true);
    const [tentativa, setTentativa] = useState(0);
    const [erro, setErro] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const [busca, setBusca] = useState('');
    const [situacao, setSituacao] = useState('todas');
    const [editor, setEditor] = useState<{ pessoa?: Pessoa } | null>(null);
    const [erroForm, setErroForm] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [alterandoId, setAlterandoId] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        listarPessoas(controller.signal)
            .then((dados) => {
                if (!controller.signal.aborted) setPessoas(dados);
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setErro(
                        'Não foi possível carregar as pessoas. Verifique se npm run api está em execução.',
                    );
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [tentativa]);

    const abrirEditor = (pessoa?: Pessoa) => {
        setErroForm(null);
        setAviso(null);
        setEditor({ pessoa });
    };

    const salvar = async (dados: DadosPessoa) => {
        setSalvando(true);
        setErroForm(null);
        try {
            const pessoa = editor?.pessoa
                ? await atualizarPessoa(editor.pessoa.id, dados)
                : await criarPessoa(dados);
            setPessoas((atuais) =>
                editor?.pessoa
                    ? atuais.map((atual) =>
                          atual.id === pessoa.id ? pessoa : atual,
                      )
                    : [...atuais, pessoa],
            );
            setEditor(null);
            setErro(null);
            setAviso('Pessoa salva com sucesso.');
        } catch {
            setErroForm(
                'Não foi possível salvar a pessoa. Confira a conexão com a API e tente novamente.',
            );
        } finally {
            setSalvando(false);
        }
    };

    const alterarSituacao = async (pessoa: Pessoa) => {
        setAlterandoId(pessoa.id);
        setErro(null);
        setAviso(null);
        try {
            const atualizada = await alterarSituacaoPessoa(
                pessoa.id,
                !pessoa.ativo,
            );
            setPessoas((atuais) =>
                atuais.map((atual) =>
                    atual.id === atualizada.id ? atualizada : atual,
                ),
            );
            setAviso(
                atualizada.ativo
                    ? 'Pessoa ativada para novos lançamentos.'
                    : 'Pessoa inativada. Os lançamentos existentes foram preservados.',
            );
        } catch {
            setErro(
                'Não foi possível alterar a situação da pessoa. Tente novamente.',
            );
        } finally {
            setAlterandoId(null);
        }
    };

    const encontradas = pessoas
        .filter(
            (pessoa) =>
                normalizar(pessoa.nome).includes(normalizar(busca.trim())) &&
                (situacao === 'todas' ||
                    pessoa.ativo === (situacao === 'ativas')),
        )
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    const ocupada = salvando || alterandoId !== null;

    return (
        <Stack spacing={2}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                    justifyContent: 'space-between',
                    alignItems: { sm: 'center' },
                }}
            >
                <Box>
                    <Typography variant="h4" component="h1">
                        Gestão de pessoas
                    </Typography>
                    <Typography color="text.secondary">
                        Cadastre clientes e fornecedores com seu endereço
                        completo.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => abrirEditor()}
                    disabled={
                        loading ||
                        ocupada ||
                        (erro !== null && pessoas.length === 0)
                    }
                >
                    Nova pessoa
                </Button>
            </Stack>
            {erro && (
                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            disabled={loading || ocupada}
                            onClick={() => {
                                setErro(null);
                                setLoading(true);
                                setTentativa((valor) => valor + 1);
                            }}
                        >
                            Tentar novamente
                        </Button>
                    }
                >
                    {erro}
                </Alert>
            )}
            {aviso && (
                <Alert
                    severity="success"
                    role="status"
                    onClose={() => setAviso(null)}
                >
                    {aviso}
                </Alert>
            )}
            <Paper sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        label="Buscar pessoa pelo nome"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Situação"
                        select
                        value={situacao}
                        onChange={(event) => setSituacao(event.target.value)}
                        size="small"
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value="todas">Todas</MenuItem>
                        <MenuItem value="ativas">Ativas</MenuItem>
                        <MenuItem value="inativas">Inativas</MenuItem>
                    </TextField>
                    <Button
                        onClick={() => {
                            setBusca('');
                            setSituacao('todas');
                        }}
                    >
                        Limpar
                    </Button>
                </Stack>
            </Paper>
            {loading ? (
                <Box
                    role="status"
                    aria-label="Carregando pessoas"
                    sx={{ textAlign: 'center', py: 6 }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        role="status"
                    >
                        {encontradas.length}{' '}
                        {encontradas.length === 1
                            ? 'pessoa encontrada'
                            : 'pessoas encontradas'}
                    </Typography>
                    {encontradas.length === 0 ? (
                        !erro && (
                            <Alert severity="info">
                                {busca || situacao !== 'todas'
                                    ? 'Nenhuma pessoa corresponde aos filtros.'
                                    : 'Nenhuma pessoa cadastrada. Clique em Nova pessoa para começar.'}
                            </Alert>
                        )
                    ) : (
                        <TableContainer component={Paper}>
                            <Table
                                aria-label="Pessoas cadastradas"
                                sx={{ minWidth: 740 }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Endereço</TableCell>
                                        <TableCell>Cidade / UF</TableCell>
                                        <TableCell>Situação</TableCell>
                                        <TableCell align="right">
                                            Ações
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {encontradas.map((pessoa) => (
                                        <TableRow key={pessoa.id}>
                                            <TableCell>{pessoa.nome}</TableCell>
                                            <TableCell>
                                                {pessoa.endereco.logradouro},{' '}
                                                {pessoa.endereco.numero}
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {pessoa.endereco.bairro} ·{' '}
                                                    {pessoa.endereco.cep}
                                                </Typography>
                                                {pessoa.endereco
                                                    .complemento && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            pessoa.endereco
                                                                .complemento
                                                        }
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {pessoa.endereco.cidade} /{' '}
                                                {pessoa.endereco.estado}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={
                                                        pessoa.ativo
                                                            ? 'Ativa'
                                                            : 'Inativa'
                                                    }
                                                    color={
                                                        pessoa.ativo
                                                            ? 'success'
                                                            : 'default'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        justifyContent:
                                                            'flex-end',
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        onClick={() =>
                                                            abrirEditor(pessoa)
                                                        }
                                                        disabled={ocupada}
                                                        aria-label={`Editar ${pessoa.nome}`}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() =>
                                                            void alterarSituacao(
                                                                pessoa,
                                                            )
                                                        }
                                                        disabled={ocupada}
                                                        aria-label={`${pessoa.ativo ? 'Inativar' : 'Ativar'} ${pessoa.nome}`}
                                                    >
                                                        {alterandoId ===
                                                        pessoa.id
                                                            ? 'Salvando...'
                                                            : pessoa.ativo
                                                              ? 'Inativar'
                                                              : 'Ativar'}
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
            {editor && (
                <PessoaForm
                    key={editor.pessoa?.id ?? 'nova'}
                    pessoa={editor.pessoa}
                    salvando={salvando}
                    erro={erroForm}
                    onSalvar={salvar}
                    onCancelar={() => setEditor(null)}
                />
            )}
        </Stack>
    );
}
