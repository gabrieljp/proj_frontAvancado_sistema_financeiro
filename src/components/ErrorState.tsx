import { Alert, Button, Stack } from '@mui/material';

interface ErrorStateProps {
    mensagem: string;
    onVoltar?: () => void;
}

export function ErrorState({ mensagem, onVoltar }: ErrorStateProps) {
    return (
        <Stack spacing={2}>
            <Alert severity="error">{mensagem}</Alert>
            {onVoltar && (
                <div>
                    <Button onClick={onVoltar}>Voltar para a lista</Button>
                </div>
            )}
        </Stack>
    );
}