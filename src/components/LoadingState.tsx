import { Box, CircularProgress } from '@mui/material';

export function LoadingState() {
    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
        </Box>
    );
}