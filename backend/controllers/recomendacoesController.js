const Recurso = require('../models/Recurso');
const Favorito = require('../models/Favorito');

const recomendacoesController = {
    listarRecomendados: async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = req.session.user;
        
        try {
            let recursos;
            const limit = user.etapa_preferida ? 20 : 15;

            if (user.etapa_preferida) {
                recursos = await Recurso.buscarPorEtapa(user.etapa_preferida, true);
                if (recursos.length > limit) recursos = recursos.slice(0, limit);
            } else {
                recursos = await Recurso.buscarTodos(true, limit, 0);
            }

            // Remover recursos que o usuário já favoritou
            const favoritosIds = await Favorito.obterIdsFavoritos(user.id);
            const recursosFiltrados = recursos.filter(r => !favoritosIds.includes(r.id));

            res.render('pages/recomendacoes/para-voce', {
                user: req.session.user,
                recursos: recursosFiltrados,
                temPreferencia: !!user.etapa_preferida,
                etapaPreferida: user.etapa_preferida,
                title: 'Para Você - E-DUCA'
            });
        } catch (error) {
            console.error('Erro ao buscar recomendações:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro ao carregar recomendações',
                user: req.session.user
            });
        }
    }
};

module.exports = recomendacoesController;