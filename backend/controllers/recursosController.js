const Recurso = require('../models/Recurso');

const recursosController = {
    listarTodos: async (req, res) => {
        try {
            const recursos = await Recurso.buscarTodos(true);
            res.render('pages/recursos/lista', {
                user: req.session.user,
                recursos,
                titulo: 'Todos os Recursos Educacionais'
            });
        } catch (error) {
            console.error('Erro ao buscar recursos:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    listarPorEtapa: async (req, res) => {
        const etapa = req.params.etapa;
        
        const etapasMap = {
            'basica': 'Basico',
            'fundamental': 'Fundamental', 
            'medio': 'Medio',
            'profissional': 'Tecnico',
            'superior': 'Superior'
        };

        const etapaBanco = etapasMap[etapa];
        
        if (!etapaBanco) {
            return res.status(404).render('pages/erro', {
                erro: 'Etapa educacional não encontrada',
                user: req.session.user
            });
        }
        
        try {
            const recursos = await Recurso.buscarPorEtapa(etapaBanco, true);
            const titulos = {
                'basica': 'Educação Básica',
                'fundamental': 'Ensino Fundamental', 
                'medio': 'Ensino Médio',
                'profissional': 'Educação Profissional',
                'superior': 'Educação Superior'
            };

            res.render('pages/recursos/lista', {
                user: req.session.user,
                recursos,
                etapa,
                titulo: titulos[etapa] || `Recursos Educacionais`
            });
        } catch (error) {
            console.error('Erro ao buscar recursos por etapa:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    buscarRecursos: async (req, res) => {
        const termo = req.query.q;
        
        if (!termo || termo.trim() === '') {
            return res.redirect('/recursos');
        }

        try {
            const recursos = await Recurso.buscarPorTermo(termo, true);
            res.render('pages/recursos/busca', {
                user: req.session.user,
                recursos,
                termo,
                total: recursos.length
            });
        } catch (error) {
            console.error('Erro na busca:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    detalhesRecurso: async (req, res) => {
        const id = req.params.id;
        
        try {
            const recurso = await Recurso.buscarPorId(id);
            if (!recurso || !recurso.ativo) {
                return res.status(404).render('pages/erro', {
                    erro: 'Recurso não encontrado',
                    user: req.session.user
                });
            }
            res.render('pages/recursos/detalhes', {
                user: req.session.user,
                recurso
            });
        } catch (error) {
            console.error('Erro ao buscar recurso:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    adminListar: async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        try {
            const recursos = await Recurso.buscarTodos(false);
            res.render('pages/admin/recursos', {
                user: req.session.user,
                recursos
            });
        } catch (error) {
            console.error('Erro ao buscar recursos para admin:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    }
};

module.exports = recursosController;