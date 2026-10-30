import { Link } from 'react-router-dom';

export function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/pessoas">Pessoas</Link>
            <Link to="/lancamentos">Lançamentos</Link>
        </nav>
    );
}