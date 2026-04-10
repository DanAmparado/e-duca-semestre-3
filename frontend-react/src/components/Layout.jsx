import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main className="container mt-4">
                {children}
            </main>
            <Footer />
        </>
    );
}
export default Layout;