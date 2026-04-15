import AdminSidebar from './AdminSidebar';

function AdminLayout({ children }) {
    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="main-content p-4" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: 1 }}>
                    {children}
                </div>
                <footer className="text-center text-muted mt-4 pt-3 border-top">
                    <small>&copy; 2025 E-DUCA - Painel Administrativo</small>
                </footer>
            </div>
        </div>
    );
}
export default AdminLayout;