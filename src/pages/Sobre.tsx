import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const equipe = [
    'Gabriel Marcos Ferreira de Oliveira',
    'Lucas Custa',
    'Gustavo (sobrenome)',
    'Miguel (sobrenome)',
];

export default function Sobre() {
    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Sobre o projeto</Typography>
            <Typography sx={{ mb: 2 }}>
                Sistema de controle de lançamentos financeiros desenvolvido em React com
                TypeScript para a disciplina de Tecnologia para Frontend Avançado (UNIESP).
            </Typography>

            <Typography variant="h6">Equipe</Typography>
            <List dense>
                {equipe.map((nome) => (
                    <ListItem key={nome} disableGutters>
                        <ListItemText primary={nome} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}