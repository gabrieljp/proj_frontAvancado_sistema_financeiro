import '../App.css';
import financas from '../assets/financas.jpg';

export function Home() {
    return (
        <div
            className='home-container'
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${financas})`
            }}
        >
            <div className="home-card">
                <h1>HOME CARD</h1>
                <p>Visão Geral do sistema</p>
            </div>
        </div>
    );
}

export default Home;