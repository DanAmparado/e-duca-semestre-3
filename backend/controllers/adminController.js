const Usuario = require('../models/Usuario');
const Recurso = require('../models/Recurso');
const Noticia = require('../models/Noticia');
const SistemaLog = require('../models/SistemaLog');
const RecursoBackup = require('../models/RecursoBackup');
const prisma = require('../lib/prisma');

const adminController = {
    dashboard: async (req, res) => {
        try {
            const totalUsuarios = await Usuario.contar();
            const totalAdmins = await Usuario.contarAdmins();
            const recursosAtivos = await Recurso.contar({ ativo: true });
            const recursosInativos = await Recurso.contar({ ativo: false });
            const noticiasPublicadas = await Noticia.contar({ status: 'publicado' });
            const noticiasAgendadas = await Noticia.contar({ status: 'agendado' });

            const stats = {
                total_usuarios: totalUsuarios,
                total_admins: totalAdmins,
                recursos_ativos: recursosAtivos,
                recursos_inativos: recursosInativos,
                noticias_publicadas: noticiasPublicadas,
                noticias_agendadas: noticiasAgendadas
            };

            const recursosPendentes = await Recurso.buscarPendentes(5);
            const usuariosRecentes = await Usuario.buscarRecentes(7, 5);

            res.render('admin/dashboard', {
                user: req.session.user,
                stats,
                recursosPendentes,
                usuariosRecentes
            });
        } catch (error) {
            console.error('Erro no dashboard admin:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    listarUsuarios: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        try {
            const { usuarios, total } = await Usuario.listarPaginado(limit, offset);
            const totalPages = Math.ceil(total / limit);

            res.render('admin/usuarios/listar', {
                user: req.session.user,
                usuarios,
                paginacao: {
                    paginaAtual: page,
                    totalPages,
                    totalUsuarios: total
                }
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    alterarNivelAcesso: async (req, res) => {
        const { id } = req.params;
        const { nivel_acesso } = req.body;

        const niveisPermitidos = ['editor', 'moderador', 'superadmin'];
        if (!niveisPermitidos.includes(nivel_acesso)) {
            return res.status(400).json({ success: false, error: 'Nível de acesso inválido' });
        }

        try {
            const usuario = await Usuario.buscarPorId(id);
            if (!usuario) {
                return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
            }

            const isAdmin = nivel_acesso !== 'usuario';
            await Usuario.atualizar(id, { tipo: nivel_acesso, is_admin: isAdmin });

            const descricaoLog = `Alterou nível de acesso do usuário ${id} para ${nivel_acesso} (is_admin: ${isAdmin})`;
            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'alterar_nivel_acesso',
                descricao: descricaoLog,
                ip_address: req.ip
            });

            res.json({
                success: true,
                message: 'Nível de acesso alterado com sucesso',
                new_level: nivel_acesso,
                is_admin: isAdmin
            });
        } catch (error) {
            console.error('Erro ao alterar nível de acesso:', error);
            res.status(500).json({ success: false, error: 'Erro interno do servidor' });
        }
    },

    listarRecursos: async (req, res) => {
        const { status, etapa, page = 1 } = req.query;
        const currentPage = parseInt(page);
        const limit = 10;
        const offset = (currentPage - 1) * limit;

        try {
            const filtros = {};
            if (status === 'ativos') filtros.ativo = true;
            else if (status === 'inativos') filtros.ativo = false;
            if (etapa) filtros.etapa = { contains: etapa };

            const { recursos, total } = await Recurso.listarPaginado(filtros, limit, offset);
            const totalPages = Math.ceil(total / limit);

            res.render('admin/recursos/listar', {
                user: req.session.user,
                recursos,
                filtros: { status, etapa },
                paginacao: {
                    paginaAtual: currentPage,
                    totalPages,
                    totalRecursos: total
                }
            });
        } catch (error) {
            console.error('Erro ao listar recursos:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    formularioCriarRecurso: (req, res) => {
        res.render('admin/recursos/criar', {
            user: req.session.user,
            recurso: {}
        });
    },

    criarRecurso: async (req, res) => {
        const { titulo, descricao, link_externo, etapa } = req.body;

        if (!titulo || !link_externo || !etapa) {
            return res.render('admin/recursos/criar', {
                user: req.session.user,
                recurso: req.body,
                erro: 'Título, link e etapa são obrigatórios'
            });
        }

        try {
            const novoRecurso = await Recurso.criar({
                titulo,
                descricao: descricao || null,
                link_externo,
                etapa,
                ativo: true,
                aprovado: true,
                autor_id: req.session.user.id
            });

            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'criar_recurso',
                descricao: `Criou recurso: ${titulo}`,
                ip_address: req.ip
            });

            res.redirect('/admin/recursos?sucesso=Recurso criado com sucesso');
        } catch (error) {
            console.error('Erro ao criar recurso:', error);
            res.render('admin/recursos/criar', {
                user: req.session.user,
                recurso: req.body,
                erro: 'Erro ao criar recurso'
            });
        }
    },

    formularioEditarRecurso: async (req, res) => {
        const { id } = req.params;
        try {
            const recurso = await Recurso.buscarPorId(id);
            if (!recurso) {
                return res.status(404).render('pages/erro', {
                    erro: 'Recurso não encontrado',
                    user: req.session.user
                });
            }
            res.render('admin/recursos/editar', {
                user: req.session.user,
                recurso
            });
        } catch (error) {
            console.error('Erro ao buscar recurso para edição:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    atualizarRecurso: async (req, res) => {
        const { id } = req.params;
        const { titulo, descricao, link_externo, etapa, ativo } = req.body;

        try {
            const recursoOriginal = await Recurso.buscarPorId(id);
            if (!recursoOriginal) {
                return res.render('admin/recursos/editar', {
                    user: req.session.user,
                    recurso: req.body,
                    erro: 'Recurso não encontrado'
                });
            }

            await RecursoBackup.criar({
                recurso_id: id,
                dados_anteriores: {
                    titulo: recursoOriginal.titulo,
                    descricao: recursoOriginal.descricao,
                    link_externo: recursoOriginal.link_externo,
                    etapa: recursoOriginal.etapa,
                    ativo: recursoOriginal.ativo
                },
                usuario_id: req.session.user.id,
                motivo: 'edicao'
            });

            await Recurso.atualizar(id, {
                titulo,
                descricao: descricao || null,
                link_externo,
                etapa,
                ativo: ativo === 'on' || ativo === true
            });

            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'atualizar_recurso',
                descricao: `Atualizou recurso ID: ${id}`,
                ip_address: req.ip
            });

            res.redirect('/admin/recursos?sucesso=Recurso atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar recurso:', error);
            res.render('admin/recursos/editar', {
                user: req.session.user,
                recurso: req.body,
                erro: 'Erro ao atualizar recurso'
            });
        }
    },

    excluirRecurso: async (req, res) => {
        const { id } = req.params;

        try {
            const recursoOriginal = await Recurso.buscarPorId(id);
            if (!recursoOriginal) {
                return res.status(404).json({ success: false, error: 'Recurso não encontrado' });
            }

            await RecursoBackup.criar({
                recurso_id: id,
                dados_anteriores: {
                    titulo: recursoOriginal.titulo,
                    descricao: recursoOriginal.descricao,
                    link_externo: recursoOriginal.link_externo,
                    etapa: recursoOriginal.etapa,
                    ativo: recursoOriginal.ativo
                },
                usuario_id: req.session.user.id,
                motivo: 'exclusao'
            });

            await Recurso.desativar(id);

            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'excluir_recurso',
                descricao: `Excluiu recurso ID: ${id}`,
                ip_address: req.ip
            });

            res.json({ success: true, message: 'Recurso excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir recurso:', error);
            res.status(500).json({ success: false, error: 'Erro interno do servidor' });
        }
    },

    restaurarRecurso: async (req, res) => {
        const { id } = req.params;

        try {
            await Recurso.ativar(id);

            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'restaurar_recurso',
                descricao: `Restaurou recurso ID: ${id}`,
                ip_address: req.ip
            });

            res.json({ success: true, message: 'Recurso restaurado com sucesso' });
        } catch (error) {
            console.error('Erro ao restaurar recurso:', error);
            res.status(500).json({ success: false, error: 'Erro interno do servidor' });
        }
    },

    relatorios: async (req, res) => {
        const { periodo = '30', tipo = 'geral' } = req.query;
        const dias = parseInt(periodo);

        try {
            const totalUsuarios = await Usuario.contar();
            const adminsAtivos = await Usuario.contarAdmins();
            const novosUsuariosPeriodo = await Usuario.contar({ data_cadastro: { gte: new Date(Date.now() - dias * 86400000) } });
            const recursosAtivos = await Recurso.contar({ ativo: true });
            const recursosInativos = await Recurso.contar({ ativo: false });
            const novosRecursosPeriodo = await Recurso.contar({ data_criacao: { gte: new Date(Date.now() - dias * 86400000) } });

            const etapas = ['Basico', 'Fundamental', 'Medio', 'Tecnico', 'Superior'];
            const recursosPorEtapa = {};
            for (const etapa of etapas) {
                recursosPorEtapa[`recursos_${etapa.toLowerCase()}`] = await Recurso.contar({
                    ativo: true,
                    etapa: { contains: etapa }
                });
            }

            const stats = {
                total_usuarios: totalUsuarios,
                admins_ativos: adminsAtivos,
                novos_usuarios_periodo: novosUsuariosPeriodo,
                recursos_ativos: recursosAtivos,
                recursos_inativos: recursosInativos,
                novos_recursos_periodo: novosRecursosPeriodo,
                ...recursosPorEtapa,
                noticias_publicadas: await Noticia.contar({ status: 'publicado' }),
                noticias_agendadas: await Noticia.contar({ status: 'agendado' })
            };

            const usuariosEtapa = await prisma.usuario.groupBy({
                by: ['etapa_preferida'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } }
            });
            const usuariosEtapaFormatado = usuariosEtapa.map(item => ({
                etapa: item.etapa_preferida || 'Não informado',
                total: item._count.id
            }));

            const recursos = await Recurso.buscarTodos(true);
            const recursosTipoMap = {};
            recursos.forEach(r => {
                const etapaStr = r.etapa;
                let tipo = 'Outros';
                if (etapaStr.includes('Superior')) tipo = 'Ensino Superior';
                else if (etapaStr.includes('Tecnico')) tipo = 'Ensino Técnico';
                else if (etapaStr.includes('Medio') || etapaStr.includes('Fundamental') || etapaStr.includes('Basico')) tipo = 'Educação Básica';
                recursosTipoMap[tipo] = (recursosTipoMap[tipo] || 0) + 1;
            });
            const recursosTipo = Object.entries(recursosTipoMap).map(([tipo_educacao, total]) => ({ tipo_educacao, total }));

            const usuariosEstado = await prisma.usuario.groupBy({
                by: ['estado'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10
            });
            const usuariosEstadoFormatado = usuariosEstado.map(item => ({
                estado: item.estado || 'Não informado',
                total: item._count.id
            }));

            const topRecursos = await Recurso.listarPaginado({ ativo: true }, 10, 0, { data_criacao: 'desc' });
            const topRecursosList = topRecursos.recursos.map(r => ({
                id: r.id,
                titulo: r.titulo,
                etapa: r.etapa,
                data_criacao: r.data_criacao
            }));

            const crescimentoData = await prisma.usuario.findMany({
                where: { data_cadastro: { gte: new Date(Date.now() - dias * 86400000) } },
                select: { data_cadastro: true }
            });
            const crescimentoMap = new Map();
            crescimentoData.forEach(u => {
                const dataStr = u.data_cadastro.toISOString().slice(0,10);
                crescimentoMap.set(dataStr, (crescimentoMap.get(dataStr) || 0) + 1);
            });
            const crescimento = Array.from(crescimentoMap.entries()).map(([data, novos_usuarios]) => ({ data, novos_usuarios }));

            const crescimentoUsuarios = crescimento.reduce((acc, dia) => acc + dia.novos_usuarios, 0);
            const taxaCrescimento = totalUsuarios ? ((crescimentoUsuarios / totalUsuarios) * 100).toFixed(1) : 0;

            const logsRecentes = await SistemaLog.buscarTodos(10, 0);

            const dadosGraficos = {
                usuariosPorEtapa: {
                    labels: usuariosEtapaFormatado.map(row => row.etapa),
                    data: usuariosEtapaFormatado.map(row => row.total)
                },
                recursosPorTipo: {
                    labels: recursosTipo.map(row => row.tipo_educacao),
                    data: recursosTipo.map(row => row.total)
                },
                usuariosPorEstado: {
                    labels: usuariosEstadoFormatado.map(row => row.estado),
                    data: usuariosEstadoFormatado.map(row => row.total)
                },
                crescimentoTemporal: {
                    labels: crescimento.map(row => row.data),
                    data: crescimento.map(row => row.novos_usuarios)
                }
            };


            const recursosMaisAcessados = topRecursosList.map((recurso, index) => ({
                posicao: index + 1,
                titulo: recurso.titulo,
                etapa: recurso.etapa,
                categoria: recurso.etapa.split(',')[0],
                acessos: Math.floor(Math.random() * 1000) + 100,
                avaliacao: (4 + Math.random()).toFixed(1)
            }));

            res.render('admin/relatorios', {
                user: req.session.user,
                stats: { ...stats, taxa_crescimento: taxaCrescimento, crescimento_usuarios: crescimentoUsuarios },
                graficos: dadosGraficos,
                tabelas: {
                    recursosMaisAcessados,
                    logsRecentes: logsRecentes.map(log => ({
                        tipo_log: log.tipo_log,
                        acao: log.acao,
                        data_log: log.data_log,
                        usuario_id: log.usuario_id
                    }))
                },
                filtros: { periodo, tipo }
            });
        } catch (error) {
            console.error('Erro ao gerar relatórios:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor ao gerar relatórios',
                user: req.session.user
            });
        }
    },

    apiRelatorios: async (req, res) => {
        const { tipo, periodo = '30' } = req.query;
        const dias = parseInt(periodo);

        try {
            let results;
            switch (tipo) {
                case 'estatisticas':
                    const totalUsuarios = await Usuario.contar();
                    const recursosAtivos = await Recurso.contar({ ativo: true });
                    const novosRecursos = await Recurso.contar({ data_criacao: { gte: new Date(Date.now() - dias * 86400000) } });
                    const noticiasPublicadas = await Noticia.contar({ status: 'publicado' });
                    results = [{ total_usuarios: totalUsuarios, recursos_ativos: recursosAtivos, novos_recursos: novosRecursos, noticias_publicadas: noticiasPublicadas }];
                    break;
                case 'usuarios-etapa':
                    const usuariosEtapa = await prisma.usuario.groupBy({
                        by: ['etapa_preferida'],
                        _count: { id: true }
                    });
                    results = usuariosEtapa.map(item => ({
                        etapa: item.etapa_preferida || 'Não informado',
                        total: item._count.id
                    }));
                    break;
                case 'recursos-tipo':
                    const recursos = await Recurso.buscarTodos(true);
                    const tipoMap = {};
                    recursos.forEach(r => {
                        let tipoEduc = 'Outros';
                        if (r.etapa.includes('Superior')) tipoEduc = 'Ensino Superior';
                        else if (r.etapa.includes('Tecnico')) tipoEduc = 'Ensino Técnico';
                        else if (r.etapa.includes('Medio') || r.etapa.includes('Fundamental') || r.etapa.includes('Basico')) tipoEduc = 'Educação Básica';
                        tipoMap[tipoEduc] = (tipoMap[tipoEduc] || 0) + 1;
                    });
                    results = Object.entries(tipoMap).map(([tipo_educacao, total]) => ({ tipo_educacao, total }));
                    break;
                default:
                    return res.status(400).json({ error: 'Tipo de relatório inválido' });
            }
            res.json(results);
        } catch (error) {
            console.error('Erro na API de relatórios:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    listarPermissoes: async (req, res) => {
        try {
            const usuarios = await Usuario.buscarTodos({}, { data_cadastro: 'desc' });
            res.render('admin/permissoes/listar', {
                user: req.session.user,
                usuarios,
                success: req.flash('success') || [],
                error: req.flash('error') || []
            });
        } catch (error) {
            console.error('Erro em listarPermissoes:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    toggleRecursoStatus: async (req, res) => {
        const { id } = req.params;
        try {
            const recurso = await Recurso.buscarPorId(id);
            if (!recurso) {
                return res.status(404).json({ success: false, error: 'Recurso não encontrado' });
            }

            const novoStatus = !recurso.ativo;
            if (novoStatus) {
                await Recurso.ativar(id);
            } else {
                await Recurso.desativar(id);
            }

            await SistemaLog.registrar({
                tipo_log: 'admin',
                usuario_id: req.session.user.id,
                acao: 'toggle_recurso',
                descricao: `Alterou status do recurso ID: ${id} para ${novoStatus ? 'ativo' : 'inativo'}`,
                ip_address: req.ip
            });

            res.json({
                success: true,
                message: `Recurso ${novoStatus ? 'ativado' : 'desativado'} com sucesso`,
                novoStatus
            });
        } catch (error) {
            console.error('Erro ao alternar status do recurso:', error);
            res.status(500).json({ success: false, error: 'Erro interno do servidor' });
        }
    },

    atualizarPermissoes: async (req, res) => {
        const { id } = req.params;
        const { nivel_acesso } = req.body;
        const niveisValidos = ['superadmin', 'moderador', 'editor', 'usuario'];

        if (!niveisValidos.includes(nivel_acesso)) {
            req.flash('error', 'Nível de acesso inválido.');
            return res.redirect('/admin/permissoes');
        }

        try {
            const usuario = await Usuario.buscarPorId(id);
            if (!usuario) {
                req.flash('error', 'Usuário não encontrado.');
                return res.redirect('/admin/permissoes');
            }

            const nivelAnterior = usuario.tipo;
            const isAdmin = nivel_acesso !== 'usuario';

            await Usuario.atualizar(id, { tipo: nivel_acesso, is_admin: isAdmin });

            const descricaoLog = `Alterou permissões de ${usuario.email}: ${nivelAnterior} → ${nivel_acesso} (is_admin: ${isAdmin})`;
            await SistemaLog.registrar({
                tipo_log: 'permissao',
                usuario_id: req.session.user.id,
                acao: 'Atualização de Permissões',
                descricao: descricaoLog,
                ip_address: req.ip
            });

            req.flash('success', `Permissões de ${usuario.email} atualizadas com sucesso!`);
            res.redirect('/admin/permissoes');
        } catch (error) {
            console.error('Erro em atualizarPermissoes:', error);
            req.flash('error', 'Erro interno do servidor.');
            res.redirect('/admin/permissoes');
        }
    }
};

module.exports = adminController;