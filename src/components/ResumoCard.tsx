import { Paper, Typography } from '@mui/material';

interface ResumoCardProps {
    titulo: string;
    valor: number;
    cor?: 'success.main' | 'error.main' | 'primary.main';
}

export function ResumoCard({ titulo, valor, cor = 'primary.main' }: ResumoCardProps) {
    return (
        <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
                {titulo}
            </Typography>
            <Typography variant="h4" sx={{ color: cor, mt: 1 }}>
                {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
        </Paper>
    );
}