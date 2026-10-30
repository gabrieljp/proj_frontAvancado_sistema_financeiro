import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Lancamentos from '../pages/Lancamentos'
import Pessoas from '../pages/Pessoas'
import { Navbar } from '../components/Navbar'


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