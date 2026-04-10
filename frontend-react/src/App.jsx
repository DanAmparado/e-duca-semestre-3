import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecursosLista from './pages/RecursosLista';
import RecursosPorEtapa from './pages/RecursosPorEtapa';
import ResultadosBusca from './pages/ResultadosBusca';
import DetalhesRecurso from './pages/DetalhesRecurso';
import Favoritos from './pages/Favoritos';
import Perfil from './pages/Perfil';
import NoticiasLista from './pages/NoticiasLista';
import NoticiasDetalhes from './pages/NoticiasDetalhes';
import Recomendacoes from './pages/Recomendacoes';

function App() {
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas (não exigem login) */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/recursos" element={<Layout><RecursosLista /></Layout>} />
                <Route path="/recursos/etapa/:etapa" element={<Layout><RecursosPorEtapa /></Layout>} />
                <Route path="/recursos/busca" element={<Layout><ResultadosBusca /></Layout>} />
                <Route path="/recursos/:id" element={<Layout><DetalhesRecurso /></Layout>} />
                <Route path="/noticias" element={<Layout><NoticiasLista /></Layout>} />
                <Route path="/noticias/:id" element={<Layout><NoticiasDetalhes /></Layout>} />
                
                {/* Rotas protegidas exigem token*/}
                <Route path="/favoritos" element={token ? <Layout><Favoritos /></Layout> : <Navigate to="/login" />} />
                <Route path="/perfil" element={token ? <Layout><Perfil /></Layout> : <Navigate to="/login" />} />
                <Route path="/recomendacoes" element={token ? <Layout><Recomendacoes /></Layout> : <Navigate to="/login" />} />
                
                {/* Redirecionamento padrão */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;