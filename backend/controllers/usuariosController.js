const Usuario = require('../models/Usuario');
const Recurso = require('../models/Recurso');

const usuariosController = {
    perfil: (req, res) => {
        res.render('pages/perfil', {
            user: req.session.user,
            title: 'Meu Perfil'
        });
    },

    formularioEditarPerfil: (req, res) => {
        res.render('pages/perfil/editar', {
            user: req.session.user,
            title: 'Editar Perfil - E-DUCA'
        });
    },

    atualizarPerfil: async (req, res) => {
        const { cidade, estado, etapa_preferida } = req.body;
        const userId = req.session.user.id;

        try {
            await Usuario.atualizar(userId, {
                cidade: cidade || null,
                estado: estado || null,
                etapa_preferida: etapa_preferida || null
            });

            req.session.user.cidade = cidade;
            req.session.user.estado = estado;
            req.session.user.etapa_preferida = etapa_preferida;

            res.redirect('/perfil?sucesso=Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.redirect('/perfil/editar?erro=Erro ao atualizar perfil');
        }
    },

    recomendacoes: async (req, res) => {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/auth/login');
        }

        let etapaFiltro = user.etapa_preferida || 'Superior';
        
        try {
            const recursos = await Recurso.buscarPorEtapa(etapaFiltro, true);
            const recursosLimitados = recursos.slice(0, 10);

            res.render('pages/recomendacoes/para-voce', {
                user: user,
                recursos: recursosLimitados,
                temPreferencia: !!user.etapa_preferida,
                etapaPreferida: user.etapa_preferida,
                title: 'Para Você - E-DUCA'
            });
        } catch (error) {
            console.error('Erro ao buscar recomendações:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro ao carregar recomendações',
                user: user
            });
        }
    }
};

module.exports = usuariosController;