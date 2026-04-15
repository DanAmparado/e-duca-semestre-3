import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

function UsuariosAdmin() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [novoNivel, setNovoNivel] = useState('');

    const fetchUsuarios = async () => {
        try {
            const res = await api.get(`/admin/usuarios?page=${page}`);
            setUsuarios(res.data.usuarios);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [page]);

    const handleAlterarNivel = async (id, nivel) => {
        try {
            await api.post(`/admin/usuarios/${id}/alterar-nivel`, { nivel_acesso: nivel });
            toast.success('Nível alterado com sucesso');
            fetchUsuarios();
        } catch (err) {
            toast.error('Erro ao alterar nível');
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <>
            <h1 className="h3 mb-4">Gerenciar Usuários</h1>
            <div className="card shadow">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr><th>ID</th><th>Email</th><th>Cidade/UF</th><th>Nível</th><th>Cadastro</th><th>Ações</th></tr>
                            </thead>
                            <tbody>
                                {usuarios.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.cidade || '-'}/{user.estado || '-'}</td>
                                        <td><span className="badge bg-secondary">{user.tipo}</span></td>
                                        <td>{new Date(user.data_cadastro).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            {editingId === user.id ? (
                                                <div className="d-flex gap-2">
                                                    <select className="form-select form-select-sm" value={novoNivel} onChange={e => setNovoNivel(e.target.value)} style={{ width: '120px' }}>
                                                        <option value="usuario">Usuário</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="moderador">Moderador</option>
                                                        <option value="superadmin">Superadmin</option>
                                                    </select>
                                                    <button className="btn btn-sm btn-success" onClick={() => {
                                                        handleAlterarNivel(user.id, novoNivel);
                                                        setEditingId(null);
                                                    }}>Salvar</button>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancelar</button>
                                                </div>
                                            ) : (
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => {
                                                    setEditingId(user.id);
                                                    setNovoNivel(user.tipo);
                                                }}>Alterar Nível</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <nav>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
export default UsuariosAdmin;