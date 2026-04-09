const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const cors = require('cors');

const app = express();

// ==================== MIDDLEWARES GLOBAIS ====================
app.use(cors()); // permite requisições do frontend React
app.use(express.json());  // IMPORTANTE: parse de JSON no body
app.use(express.urlencoded({ extended: true }));

// ==================== ROTAS DA API (versão 1) ====================
const apiAuth = require('./api/v1/auth');
const apiRecursos = require('./api/v1/recursos');
const apiFavoritos = require('./api/v1/favoritos');
const apiNoticias = require('./api/v1/noticias');

app.use('/api/v1/noticias', apiNoticias);
app.use('/api/v1/auth', apiAuth);
app.use('/api/v1/recursos', apiRecursos);
app.use('/api/v1/favoritos', apiFavoritos);

// ==================== CONFIGURAÇÕES DAS VIEWS (EJS) ====================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ==================== SESSÃO E FLASH (para as rotas antigas) ====================
app.use(session({
    secret: 'educa-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// ==================== ROTAS ANTIGAS (EJS) ====================
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/indexRoutes');
const recursosRoutes = require('./routes/recursosRoutes');
const noticiasRoutes = require('./routes/noticiasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recomendacoesRoutes = require('./routes/recomendacoesRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');

app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/recursos', recursosRoutes);
app.use('/noticias', noticiasRoutes);
app.use('/', usuariosRoutes);
app.use('/admin', adminRoutes);
app.use('/recomendacoes', recomendacoesRoutes);
app.use('/favoritos', favoritosRoutes);

// ==================== TRATAMENTO DE ERROS ====================
app.use((req, res) => {
    res.status(404).render('pages/erro', {
        erro: 'Página não encontrada',
        user: req.session.user
    });
});

app.use((err, req, res, next) => {
    console.error('Erro do servidor:', err);
    res.status(500).render('pages/erro', {
        erro: 'Erro interno do servidor',
        user: req.session.user
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
    console.log(`Painel Admin: http://localhost:${PORT}/admin`);
});