import { useNavigate } from 'react-router-dom';
import '../App.css';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-card">
                <h1>SISTEMA FINANCEIRO</h1>
                <p>Seja bem-vindo ao Sistema Financeiro. Escolha uma das opções abaixo para começar:</p>

                <div className="home-actions">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-login"
                    >
                        Entrar
                    </button>

                    <button
                        onClick={() => navigate('/cadastro')}
                        className="btn-cadastro"
                    >
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;