import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecursosLista from './pages/RecursosLista';
import DetalhesRecurso from './pages/DetalhesRecurso';
import Favoritos from './pages/Favoritos';
import Perfil from './pages/Perfil';
import NoticiasLista from './pages/NoticiasLista';
import NoticiasDetalhes from './pages/NoticiasDetalhes';

function App() {
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/recursos" element={token ? <RecursosLista /> : <Navigate to="/login" />} />
                <Route path="/recursos/:id" element={token ? <DetalhesRecurso /> : <Navigate to="/login" />} />
                <Route path="/favoritos" element={token ? <Favoritos /> : <Navigate to="/login" />} />
                <Route path="/perfil" element={token ? <Perfil /> : <Navigate to="/login" />} />
                <Route path="/noticias" element={<NoticiasLista />} />
                <Route path="/noticias/:id" element={<NoticiasDetalhes />} />
                <Route path="*" element={<Navigate to="/recursos" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;