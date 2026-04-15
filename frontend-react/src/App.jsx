import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecursosLista from './pages/RecursosLista';
import ResultadosBusca from './pages/ResultadosBusca';
import DetalhesRecurso from './pages/DetalhesRecurso';
import Favoritos from './pages/Favoritos';
import Perfil from './pages/Perfil';
import NoticiasLista from './pages/NoticiasLista';
import NoticiasDetalhes from './pages/NoticiasDetalhes';
import Recomendacoes from './pages/Recomendacoes';
import Sobre from './pages/Sobre';import AdminLayout from './components/admin/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/admin/Dashboard';
import RecursosAdmin from './pages/admin/RecursosAdmin';
import NoticiasAdmin from './pages/admin/NoticiasAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import LogsSistema from './pages/admin/LogsSistema';
import RelatoriosAdmin from './pages/admin/RelatoriosAdmin';

function App() {
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas (não exigem login) */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/cadastro" element={<Layout><Cadastro /></Layout>} />
                <Route path="/recursos" element={<Layout><RecursosLista /></Layout>} />
                <Route path="/recursos/busca" element={<Layout><ResultadosBusca /></Layout>} />
                <Route path="/recursos/:id" element={<Layout><DetalhesRecurso /></Layout>} />
                <Route path="/noticias" element={<Layout><NoticiasLista /></Layout>} />
                <Route path="/noticias/:id" element={<Layout><NoticiasDetalhes /></Layout>} />
                
                {/* Rotas protegidas exigem token*/}
                <Route path="/favoritos" element={token ? <Layout><Favoritos /></Layout> : <Navigate to="/login" />} />
                <Route path="/perfil" element={token ? <Layout><Perfil /></Layout> : <Navigate to="/login" />} />
                <Route path="/recomendacoes" element={token ? <Layout><Recomendacoes /></Layout> : <Navigate to="/login" />} />
                <Route path="/sobre" element={<Layout><Sobre /></Layout>} />
                
                {/* Rotas Administrativas*/}
                <Route path="/admin" element={
                    <PrivateRoute requiredRole="editor">
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/dashboard" element={
                    <PrivateRoute requiredRole="editor">
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/recursos" element={
                    <PrivateRoute requiredRole="editor">
                        <AdminLayout>
                            <RecursosAdmin />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/dashboard" element={
                    <PrivateRoute requiredRole="editor">
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/recursos" element={
                    <PrivateRoute requiredRole="editor">
                        <AdminLayout>
                            <RecursosAdmin />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/noticias" element={
                    <PrivateRoute requiredRole="editor">
                        <AdminLayout>
                            <NoticiasAdmin />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/usuarios" element={
                    <PrivateRoute requiredRole="superadmin">
                        <AdminLayout>
                            <UsuariosAdmin />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/logs" element={
                    <PrivateRoute requiredRole="moderador">
                        <AdminLayout>
                            <LogsSistema />
                        </AdminLayout>
                    </PrivateRoute>
                } />
                <Route path="/admin/relatorios" element={
                    <PrivateRoute requiredRole="editor">
                        <AdminLayout>
                            <RelatoriosAdmin />
                        </AdminLayout>
                    </PrivateRoute>
                } />

                {/* Redirecionamento padrão */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;