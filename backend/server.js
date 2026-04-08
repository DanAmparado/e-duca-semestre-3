const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');

const app = express();

const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/indexRoutes');
const recursosRoutes = require('./routes/recursosRoutes');
const noticiasRoutes = require('./routes/noticiasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recomendacoesRoutes = require('./routes/recomendacoesRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/recursos', recursosRoutes);
app.use('/noticias', noticiasRoutes);
app.use('/', usuariosRoutes);
app.use('/admin', adminRoutes);
app.use('/recomendacoes', recomendacoesRoutes);
app.use('/favoritos', favoritosRoutes);

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