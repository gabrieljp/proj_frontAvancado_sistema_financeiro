import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'


export function AppRoutes() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lancamentos" element={<Lancamentos />} />
                <Route path="/pessoas" element={<Pessoas />} />
            </Routes>
        </BrowserRouter>
    );
}