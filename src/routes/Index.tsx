import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import Home from '../pages/Home';
import Lancamentos from '../pages/Lancamentos';
import LancamentoForm from '../pages/LancamentoForm';
import Pessoas from '../pages/Pessoas';
import Sobre from '../pages/Sobre';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="lancamentos" element={<Lancamentos />} />
                    <Route path="lancamentos/novo" element={<LancamentoForm />} />
                    <Route path="pessoas" element={<Pessoas />} />
                    <Route path="sobre" element={<Sobre />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}