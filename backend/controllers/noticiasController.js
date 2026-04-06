const Noticia = require('../models/Noticia');
const SistemaLog = require('../models/SistemaLog');

const noticiasController = {
    // Listagem pública (com paginação e filtro por etapa)
    listarTodos: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;
            const etapa = req.query.etapa || null;

            let where = { status: 'publicado' };
            if (etapa) {
                where.etapa_educacional = etapa;
            }

            const { noticias, total } = await Noticia.listarPaginado(where, limit, offset);
            const totalPages = Math.ceil(total / limit);

            res.render('pages/noticias/index', {
                user: req.session.user,
                noticias,
                paginacao: { page, totalPages, total },
                etapaFiltro: etapa,
                title: 'Notícias - E-DUCA',
                currentPage: 'noticias'
            });
        } catch (error) {
            console.error('Erro ao listar notícias:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro ao carregar notícias',
                user: req.session.user
            });
        }
    },

    // Detalhes de uma notícia pública
    detalhesNoticia: async (req, res) => {
        const { id } = req.params;
        try {
            const noticia = await Noticia.buscarPorId(id);
            if (!noticia || noticia.status !== 'publicado') {
                return res.status(404).render('pages/erro', {
                    erro: 'Notícia não encontrada',
                    user: req.session.user
                });
            }
            res.render('pages/noticias/detalhes', {
                user: req.session.user,
                noticia,
                title: `${noticia.titulo} - E-DUCA`,
                currentPage: 'noticias'
            });
        } catch (error) {
            console.error('Erro ao buscar notícia:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno',
                user: req.session.user
            });
        }
    },

    // ADMIN: Listar todas as notícias (com todos os status)
    adminListar: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;
            const { noticias, total } = await Noticia.listarPaginado({}, limit, offset);
            const totalPages = Math.ceil(total / limit);

            res.render('admin/noticias/listar', {
                user: req.session.user,
                noticias,
                paginacao: { page, totalPages, total },
                title: 'Gerenciar Notícias',
                currentPage: 'noticias'   // adicione esta linha
            });
            } catch (error) {
            console.error('Erro ao listar notícias (admin):', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno',
                user: req.session.user
            });
        }
    },

    // ADMIN: Formulário de criação
    formularioCriar: (req, res) => {
        res.render('admin/noticias/criar', {
            user: req.session.user,
            noticia: {},
            title: 'Criar Notícia',
            currentPage: 'noticias'
        });
    },

    // ADMIN: Criar notícia
    criar: async (req, res) => {
        const { titulo, conteudo, status, data_agendamento, etapa_educacional } = req.body;
        try {
            // Converter data_agendamento para Date ou null
            let dataAgendamento = null;
            if (data_agendamento && data_agendamento.trim() !== '') {
                dataAgendamento = new Date(data_agendamento);
                if (isNaN(dataAgendamento.getTime())) {
                    dataAgendamento = null;
                }
            }

            const novaNoticia = await Noticia.criar({
                titulo,
                conteudo,
                status: status || 'rascunho',
                data_agendamento: dataAgendamento,
                etapa_educacional: etapa_educacional || null,
                autor_id: req.session.user.id
            });

            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'criar_noticia',
                descricao: `Criou notícia: ${titulo}`,
                ip_address: req.ip
            });

            req.flash('success', 'Notícia criada com sucesso');
            res.redirect('/admin/noticias');
        } catch (error) {
            console.error('Erro ao criar notícia:', error);
            let mensagemErro = 'Erro ao criar notícia. Verifique os dados.';
            if (error.code === 'P2002') {
                mensagemErro = 'Já existe uma notícia com esse título.';
            } else if (error.message && error.message.includes('data_agendamento')) {
                mensagemErro = 'Data de agendamento inválida.';
            }
            req.flash('error', mensagemErro);
            res.render('admin/noticias/criar', {
                user: req.session.user,
                noticia: req.body,
                erro: mensagemErro
            });
        }
    },

    // ADMIN: Formulário de edição
    formularioEditar: async (req, res) => {
        const { id } = req.params;
        try {
            const noticia = await Noticia.buscarPorId(id);
            if (!noticia) {
                req.flash('error', 'Notícia não encontrada');
                return res.redirect('/admin/noticias');
            }
            res.render('admin/noticias/editar', {
                user: req.session.user,
                noticia,
                title: 'Editar Notícia',
                currentPage: 'noticias'
            });
        } catch (error) {
            console.error('Erro ao buscar notícia para edição:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno',
                user: req.session.user
            });
        }
    },

    // ADMIN: Atualizar notícia
    atualizar: async (req, res) => {
        const { id } = req.params;
        const { titulo, conteudo, status, data_agendamento, etapa_educacional } = req.body;
        try {
            let dataAgendamento = null;
            if (data_agendamento && data_agendamento.trim() !== '') {
                dataAgendamento = new Date(data_agendamento);
                if (isNaN(dataAgendamento.getTime())) dataAgendamento = null;
            }

            await Noticia.atualizar(id, {
                titulo,
                conteudo,
                status,
                data_agendamento: dataAgendamento,
                etapa_educacional: etapa_educacional || null
            });

            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'atualizar_noticia',
                descricao: `Atualizou notícia ID: ${id}`,
                ip_address: req.ip
            });

            req.flash('success', 'Notícia atualizada com sucesso');
            res.redirect('/admin/noticias');
        } catch (error) {
            console.error('Erro ao atualizar notícia:', error);
            req.flash('error', 'Erro ao atualizar notícia');
            res.redirect(`/admin/noticias/editar/${id}`);
        }
    },

    // ADMIN: Publicar notícia
    publicar: async (req, res) => {
        const { id } = req.params;
        try {
            await Noticia.publicar(id);
            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'publicar_noticia',
                descricao: `Publicou notícia ID: ${id}`,
                ip_address: req.ip
            });
            req.flash('success', 'Notícia publicada');
            res.redirect('/admin/noticias');
        } catch (error) {
            console.error('Erro ao publicar notícia:', error);
            req.flash('error', 'Erro ao publicar');
            res.redirect('/admin/noticias');
        }
    },

    // ADMIN: Arquivar notícia
    arquivar: async (req, res) => {
        const { id } = req.params;
        try {
            await Noticia.arquivar(id);
            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'arquivar_noticia',
                descricao: `Arquivou notícia ID: ${id}`,
                ip_address: req.ip
            });
            req.flash('success', 'Notícia arquivada');
            res.redirect('/admin/noticias');
        } catch (error) {
            console.error('Erro ao arquivar notícia:', error);
            req.flash('error', 'Erro ao arquivar');
            res.redirect('/admin/noticias');
        }
    },

    // ADMIN: Excluir notícia permanentemente
    excluir: async (req, res) => {
        const { id } = req.params;
        try {
            await Noticia.excluir(id);
            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'excluir_noticia',
                descricao: `Excluiu notícia ID: ${id}`,
                ip_address: req.ip
            });
            req.flash('success', 'Notícia excluída permanentemente');
            res.redirect('/admin/noticias');
        } catch (error) {
            console.error('Erro ao excluir notícia:', error);
            req.flash('error', 'Erro ao excluir');
            res.redirect('/admin/noticias');
        }
    }
};

module.exports = noticiasController;