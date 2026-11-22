import { Typography, Paper } from '@mui/material';

export default function Home() {
    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Sistema Financeiro</Typography>
            <Typography>Controle de receitas, despesas e pessoas em um só lugar.</Typography>
        </Paper>
    );
}