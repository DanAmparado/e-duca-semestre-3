function Footer() {
    return (
        <footer className="bg-dark text-light py-4 mt-5">
            <div className="container text-center">
                <img src="/images/logo%20simples%20branca.png" alt="E-DUCA" className="footer-logo" style={{ height: '30px', marginBottom: '1rem' }} />
                <p className="mb-2">Plataforma de democratização do acesso à educação</p>
                <a href="/" className="btn btn-outline-light btn-sm mb-3">Voltar ao Início</a>
                <p className="mb-0">&copy; 2025 E-DUCA - Todos os direitos reservados</p>
            </div>
        </footer>
    );
}
export default Footer;