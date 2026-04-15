const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API (v1)
const apiAuth = require('./api/v1/auth');
const apiRecursos = require('./api/v1/recursos');
const apiFavoritos = require('./api/v1/favoritos');
const apiNoticias = require('./api/v1/noticias');
const apiAdmin = require('./api/v1/admin');

app.use('/api/v1/auth', apiAuth);
app.use('/api/v1/recursos', apiRecursos);
app.use('/api/v1/favoritos', apiFavoritos);
app.use('/api/v1/noticias', apiNoticias);
app.use('/api/v1/admin', apiAdmin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
    console.log(`API disponível em http://localhost:${PORT}/api/v1`);
});