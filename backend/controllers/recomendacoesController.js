const Recurso = require('../models/Recurso');

const recomendacoesController = {
    listarRecomendados: async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = req.session.user;
        
        console.log('🔍 DEBUG - Buscando recomendações para:', user.email);
        console.log('🔍 DEBUG - Etapa preferida:', user.etapa_preferida);
        
        try {
            let recursos;
            const limit = user.etapa_preferida ? 20 : 15;

            if (user.etapa_preferida) {
                recursos = await Recurso.buscarPorEtapa(user.etapa_preferida, true);
                if (recursos.length > limit) recursos = recursos.slice(0, limit);
            } else {
                recursos = await Recurso.buscarTodos(true, limit, 0);
            }
            
            res.render('pages/recomendacoes/para-voce', {
                user: req.session.user,
                recursos: recursos,
                temPreferencia: !!user.etapa_preferida,
                etapaPreferida: user.etapa_preferida
            });
        } catch (error) {
            console.error('Erro ao buscar recomendações:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    }
};

module.exports = recomendacoesController;