import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Lancamentos from '../pages/Lancamentos'
import Pessoas from '../pages/Pessoas'
import { Navbar } from '../components/Navbar'
import chapeu from '../assets/chapeu.png'
import gamificacao from '../assets/gamificacao.png'


export function AppRoutes() {
    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lancamentos" element={<Lancamentos />} />
                    <Route path="/pessoas" element={<Pessoas />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p><img className='gamificacao-footer' src={gamificacao} alt="Logo do projeto" />&copy; 2026 Sistema Financeiro - Faculdade UNIESP </p>
            </footer>
        </BrowserRouter>
    );
}