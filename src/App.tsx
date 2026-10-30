
import './App.css'
import Lancamentos from './pages/Lancamentos'
import Pessoas from './pages/Pessoas'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Lancamentos />} />
        <Route path="/sobre" element={<Pessoas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
