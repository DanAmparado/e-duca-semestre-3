const Favorito = require('../models/Favorito');

const favoritosController = {
    // Listar favoritos do usuário
    listar: async (req, res) => {
        if (!req.session.user) return res.redirect('/auth/login');
        try {
            const favoritos = await Favorito.listarPorUsuario(req.session.user.id);
            res.render('pages/favoritos', {
                user: req.session.user,
                favoritos,
                title: 'Meus Favoritos - E-DUCA'
            });
        } catch (error) {
            console.error('Erro ao listar favoritos:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro ao carregar favoritos',
                user: req.session.user
            });
        }
    },

    // Adicionar favorito 
    adicionar: async (req, res) => {
        const { id } = req.params;
        if (!req.session.user) {
            return res.status(401).json({ error: 'Login necessário' });
        }
        try {
            await Favorito.adicionar(req.session.user.id, id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Erro ao favoritar' });
        }
    },

    // Remover favorito
    remover: async (req, res) => {
        const { id } = req.params;
        if (!req.session.user) {
            return res.status(401).json({ error: 'Login necessário' });
        }
        try {
            await Favorito.remover(req.session.user.id, id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Erro ao remover favorito' });
        }
    },

    // Verificar se um recurso específico está favoritado
    check: async (req, res) => {
        const { id } = req.params;
        if (!req.session.user) return res.status(401).json({ error: 'Login necessário' });
        const favoritado = await Favorito.isFavorito(req.session.user.id, id);
        res.json({ favoritado });
    }
};

module.exports = favoritosController;