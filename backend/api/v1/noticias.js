const express = require('express');
const router = express.Router();
const Noticia = require('../../models/Noticia');
const jwtAuth = require('../../middleware/jwtAuth');

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
        const { noticias, total } = await Noticia.listarPaginado({ status: 'publicado' }, limit, offset);
        res.json({ noticias, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar notícias' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const noticia = await Noticia.buscarPorId(id);
        if (!noticia || noticia.status !== 'publicado') {
            return res.status(404).json({ error: 'Notícia não encontrada' });
        }
        res.json(noticia);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar notícia' });
    }
});


module.exports = router;