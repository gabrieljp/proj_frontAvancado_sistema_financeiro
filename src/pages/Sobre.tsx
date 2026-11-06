import { Typography, Paper } from '@mui/material';

export default function Sobre() {
    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Sobre o projeto</Typography>
            <Typography sx={{ mb: 2 }}>
                Sistema de controle de lançamentos financeiros desenvolvido em React com
                TypeScript para a disciplina de Tecnologia para Frontend Avançado (UNIESP).
            </Typography>
            <Typography variant="h6">Equipe</Typography>
            <Typography>Gabriel, Lucas, Gustavo e Soares</Typography>
        </Paper>
    );
}