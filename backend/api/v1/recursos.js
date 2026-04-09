const express = require('express');
const router = express.Router();
const Recurso = require('../../models/Recurso');
const jwtAuth = require('../../middleware/jwtAuth');

// Listar recursos (pública)
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
        const { recursos, total } = await Recurso.listarPaginado({ ativo: true }, limit, offset);
        res.json({ recursos, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar recursos' });
    }
});

// GET /api/v1/recursos/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await Recurso.buscarPorId(id);
        if (!recurso || !recurso.ativo) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }
        res.json(recurso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar recurso' });
    }
});

// Exemplo de rota protegida: favoritar (requer token)
router.post('/:id/favoritar', jwtAuth, async (req, res) => {
    const { id } = req.params;
    const Favorito = require('../../models/Favorito');
    try {
        await Favorito.adicionar(req.userId, id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao favoritar' });
    }
});

module.exports = router;