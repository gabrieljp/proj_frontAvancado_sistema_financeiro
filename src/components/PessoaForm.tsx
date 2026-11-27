import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import type { Pessoa } from '../types';
import type { DadosPessoa } from '../services/pessoaService';

const estados =
    'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(
        ' ',
    );

interface PessoaFormProps {
    pessoa?: Pessoa;
    salvando: boolean;
    erro: string | null;
    onSalvar: (dados: DadosPessoa) => Promise<void>;
    onCancelar: () => void;
}

export default function PessoaForm({
    pessoa,
    salvando,
    erro,
    onSalvar,
    onCancelar,
}: PessoaFormProps) {
    const [erroValidacao, setErroValidacao] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (salvando) return;
        const formulario = new FormData(event.currentTarget);
        const texto = (campo: string) =>
            String(formulario.get(campo) ?? '').trim();
        const dados: DadosPessoa = {
            nome: texto('nome'),
            ativo: formulario.get('ativo') === 'on',
            endereco: {
                logradouro: texto('logradouro'),
                numero: texto('numero'),
                complemento: texto('complemento'),
                bairro: texto('bairro'),
                cep: texto('cep'),
                cidade: texto('cidade'),
                estado: texto('estado'),
            },
        };
        const obrigatorios = [
            dados.nome,
            dados.endereco.logradouro,
            dados.endereco.numero,
            dados.endereco.bairro,
            dados.endereco.cep,
            dados.endereco.cidade,
            dados.endereco.estado,
        ];
        if (obrigatorios.some((valor) => !valor)) {
            setErroValidacao(
                'Preencha os campos obrigatórios. Espaços em branco não são aceitos.',
            );
            return;
        }
        if (
            !/^\d{5}-?\d{3}$/.test(dados.endereco.cep) ||
            !estados.includes(dados.endereco.estado)
        ) {
            setErroValidacao(
                'Confira o CEP (8 dígitos) e selecione uma UF válida.',
            );
            return;
        }
        setErroValidacao(null);
        void onSalvar(dados);
    };

    return (
        <Dialog
            open
            fullWidth
            maxWidth="sm"
            onClose={salvando ? undefined : onCancelar}
            aria-labelledby="pessoa-form-titulo"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="pessoa-form-titulo">
                    {pessoa ? 'Editar pessoa' : 'Nova pessoa'}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {(erroValidacao || erro) && (
                            <Alert severity="error">
                                {erroValidacao || erro}
                            </Alert>
                        )}
                        <TextField
                            name="nome"
                            label="Nome"
                            defaultValue={pessoa?.nome ?? ''}
                            required
                            autoFocus
                            fullWidth
                            disabled={salvando}
                            slotProps={{ htmlInput: { maxLength: 150 } }}
                        />
                        <Typography variant="subtitle1" component="h2">
                            Endereço
                        </Typography>
                        <TextField
                            name="logradouro"
                            label="Logradouro"
                            defaultValue={pessoa?.endereco.logradouro ?? ''}
                            required
                            fullWidth
                            disabled={salvando}
                            slotProps={{ htmlInput: { maxLength: 150 } }}
                        />
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                        >
                            <TextField
                                name="numero"
                                label="Número"
                                defaultValue={pessoa?.endereco.numero ?? ''}
                                required
                                fullWidth
                                disabled={salvando}
                                slotProps={{ htmlInput: { maxLength: 20 } }}
                            />
                            <TextField
                                name="complemento"
                                label="Complemento"
                                defaultValue={
                                    pessoa?.endereco.complemento ?? ''
                                }
                                fullWidth
                                disabled={salvando}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                        </Stack>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                        >
                            <TextField
                                name="bairro"
                                label="Bairro"
                                defaultValue={pessoa?.endereco.bairro ?? ''}
                                required
                                fullWidth
                                disabled={salvando}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                            <TextField
                                name="cep"
                                label="CEP"
                                defaultValue={pessoa?.endereco.cep ?? ''}
                                required
                                fullWidth
                                disabled={salvando}
                                helperText="00000-000 ou 8 dígitos"
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 9,
                                        pattern: '[0-9]{5}-?[0-9]{3}',
                                        inputMode: 'numeric',
                                    },
                                }}
                            />
                        </Stack>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                        >
                            <TextField
                                name="cidade"
                                label="Cidade"
                                defaultValue={pessoa?.endereco.cidade ?? ''}
                                required
                                fullWidth
                                disabled={salvando}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                            <TextField
                                name="estado"
                                label="Estado (UF)"
                                select
                                defaultValue={pessoa?.endereco.estado ?? ''}
                                required
                                fullWidth
                                disabled={salvando}
                                slotProps={{
                                    select: { native: true },
                                    inputLabel: { shrink: true },
                                }}
                            >
                                <option value="">Selecione</option>
                                {estados.map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </TextField>
                        </Stack>
                        <FormControlLabel
                            label="Pessoa ativa para novos lançamentos"
                            control={
                                <Switch
                                    name="ativo"
                                    defaultChecked={pessoa?.ativo ?? true}
                                    disabled={salvando}
                                />
                            }
                        />
                        <Typography variant="caption" color="text.secondary">
                            * Campos obrigatórios. O complemento é opcional.
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onCancelar} disabled={salvando}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={salvando}
                    >
                        {salvando ? 'Salvando...' : 'Salvar pessoa'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
