const express = require('express');
const router = express.Router();
const Recurso = require('../../models/Recurso');
const Usuario = require('../../models/Usuario');
const jwtAuth = require('../../middleware/jwtAuth');
const prisma = require('../../lib/prisma');

// ========== ROTAS PÚBLICAS ==========
router.get('/', async (req, res) => {
    const limit = req.query.limit === 'all' ? undefined : (parseInt(req.query.limit) || 10);
    const page = parseInt(req.query.page) || 1;
    const offset = limit ? (page - 1) * limit : undefined;
    try {
        const recursos = await prisma.recurso.findMany({
            where: { ativo: true },
            take: limit,
            skip: offset,
            orderBy: { data_criacao: 'desc' }
        });
        const total = await prisma.recurso.count({ where: { ativo: true } });
        res.json({ recursos, total, page, totalPages: limit ? Math.ceil(total / limit) : 1 });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar recursos' });
    }
});

// Busca por termo (case‑insensitive)
router.get('/buscar', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ recursos: [] });
    try {
        const recursos = await Recurso.buscarPorTermo(q, true);
        res.json({ recursos });
    } catch (error) {
        res.status(500).json({ error: 'Erro na busca' });
    }
});

// Filtrar por etapa (público)
router.get('/etapa/:etapa', async (req, res) => {
    const { etapa } = req.params;
    const etapasMap = {
        basica: 'Basico',
        profissional: 'Tecnico',
        superior: 'Superior'
    };
    const etapaBanco = etapasMap[etapa] || etapa;
    try {
        const recursos = await Recurso.buscarPorEtapa(etapaBanco, true);
        res.json({ recursos });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao filtrar recursos' });
    }
});

// Recomendados
router.get('/recomendados', jwtAuth, async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorId(req.userId);
        const etapa = usuario?.etapa_preferida;
        let recursos;
        if (etapa) {
            recursos = await Recurso.buscarPorEtapa(etapa, true);
        } else {
            recursos = await Recurso.buscarTodos(true, 20);
        }
        res.json({ recursos });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar recomendações' });
    }
});

// Detalhes de um recurso (público)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await Recurso.buscarPorId(id);
        if (!recurso || !recurso.ativo) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }
        res.json(recurso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar recurso' });
    }
});

// Favoritar
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

// Desfavoritar
router.delete('/:id/favoritar', jwtAuth, async (req, res) => {
    const { id } = req.params;
    const Favorito = require('../../models/Favorito');
    try {
        await Favorito.remover(req.userId, id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao desfavoritar' });
    }
});

module.exports = router;