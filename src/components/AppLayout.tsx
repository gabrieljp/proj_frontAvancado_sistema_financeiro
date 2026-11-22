import { Link as RouterLink, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

const links = [
    { to: '/', label: 'Home' },
    { to: '/lancamentos', label: 'Lançamentos' },
    { to: '/pessoas', label: 'Pessoas' },
    { to: '/sobre', label: 'Sobre' },
];

export function AppLayout() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Sistema Financeiro
                    </Typography>
                    {links.map((l) => (
                        <Button key={l.to} color="inherit" component={RouterLink} to={l.to}>
                            {l.label}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{ flex: 1, py: 4 }}>
                <Outlet />
            </Container>

            <Box
                component="footer"
                sx={{ py: 2, textAlign: 'center', bgcolor: 'grey.900', color: 'grey.400' }}
            >
                © 2026 Sistema Financeiro – UNIESP
            </Box>
        </Box>
    );
}