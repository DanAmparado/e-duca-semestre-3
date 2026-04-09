const express = require('express');
const router = express.Router();
const Favorito = require('../../models/Favorito');
const jwtAuth = require('../../middleware/jwtAuth');

// Todos os endpoints exigem autenticação
router.use(jwtAuth);

// Listar favoritos do usuário
router.get('/', async (req, res) => {
    try {
        const favoritos = await Favorito.listarPorUsuario(req.userId);
        res.json({ favoritos });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar favoritos' });
    }
});

// Adicionar favorito
router.post('/:recursoId', async (req, res) => {
    const { recursoId } = req.params;
    try {
        await Favorito.adicionar(req.userId, recursoId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao favoritar' });
    }
});

// Remover favorito
router.delete('/:recursoId', async (req, res) => {
    const { recursoId } = req.params;
    try {
        await Favorito.remover(req.userId, recursoId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao desfavoritar' });
    }
});

module.exports = router;