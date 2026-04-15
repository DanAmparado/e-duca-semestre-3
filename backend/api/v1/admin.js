const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');
const jwtAuth = require('../../middleware/jwtAuth');

const requireAdmin = (req, res, next) => {
    if (!req.userTipo || req.userTipo === 'usuario') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
};

router.use(jwtAuth);
router.use(requireAdmin);

router.get('/stats', async (req, res) => {
    try {
        const [totalUsuarios, totalAdmins, recursosAtivos, recursosInativos, noticiasPublicadas, noticiasAgendadas] = await Promise.all([
            prisma.usuario.count(),
            prisma.usuario.count({ where: { is_admin: true } }),
            prisma.recurso.count({ where: { ativo: true } }),
            prisma.recurso.count({ where: { ativo: false } }),
            prisma.noticia.count({ where: { status: 'publicado' } }),
            prisma.noticia.count({ where: { status: 'agendado' } })
        ]);
        res.json({
            total_usuarios: totalUsuarios,
            total_admins: totalAdmins,
            recursos_ativos: recursosAtivos,
            recursos_inativos: recursosInativos,
            noticias_publicadas: noticiasPublicadas,
            noticias_agendadas: noticiasAgendadas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

router.get('/recent-users', async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    try {
        const users = await prisma.usuario.findMany({
            take: limit,
            orderBy: { data_cadastro: 'desc' },
            select: { id: true, email: true, cidade: true, estado: true, data_cadastro: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários recentes' });
    }
});

router.get('/pending-resources', async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    try {
        const resources = await prisma.recurso.findMany({
            where: { ativo: false },
            take: limit,
            orderBy: { data_criacao: 'desc' },
            select: { id: true, titulo: true, etapa: true, data_criacao: true }
        });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar recursos pendentes' });
    }
});

router.get('/user-growth', async (req, res) => {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    try {
        const results = await prisma.$queryRaw`
            SELECT DATE(data_cadastro) as data, COUNT(*) as novos_usuarios
            FROM usuarios
            WHERE data_cadastro >= ${startDate}
            GROUP BY DATE(data_cadastro)
            ORDER BY data ASC
        `;
        res.json(results);
    } catch (error) {
        const users = await prisma.usuario.findMany({
            where: { data_cadastro: { gte: startDate } },
            select: { data_cadastro: true }
        });
        const map = new Map();
        users.forEach(u => {
            const date = u.data_cadastro.toISOString().split('T')[0];
            map.set(date, (map.get(date) || 0) + 1);
        });
        const formatted = Array.from(map.entries()).map(([data, novos_usuarios]) => ({ data, novos_usuarios }));
        res.json(formatted);
    }
});

// ==================== RECURSOS ADMIN ====================
router.get('/recursos', async (req, res) => {
    const { status, etapa } = req.query;
    let where = {};
    if (status === 'ativos') where.ativo = true;
    if (status === 'inativos') where.ativo = false;
    if (etapa) where.etapa = { contains: etapa };
    const recursos = await prisma.recurso.findMany({ where, orderBy: { data_criacao: 'desc' } });
    res.json(recursos);
});

router.post('/recursos', async (req, res) => {
    const { titulo, descricao, link_externo, etapa, ativo } = req.body;
    const novo = await prisma.recurso.create({
        data: {
            titulo,
            descricao,
            link_externo,
            etapa,
            ativo: ativo !== undefined ? ativo : true,
            autor_id: req.userId,
            aprovado: true
        }
    });
    res.status(201).json(novo);
});

router.put('/recursos/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, link_externo, etapa, ativo } = req.body;
    const atualizado = await prisma.recurso.update({
        where: { id },
        data: { titulo, descricao, link_externo, etapa, ativo, data_atualizacao: new Date() }
    });
    res.json(atualizado);
});

router.delete('/recursos/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.recurso.delete({ where: { id } });
    res.json({ success: true });
});

router.post('/recursos/:id/toggle', async (req, res) => {
    const { id } = req.params;
    const recurso = await prisma.recurso.findUnique({ where: { id } });
    const novoStatus = !recurso.ativo;
    await prisma.recurso.update({ where: { id }, data: { ativo: novoStatus } });
    res.json({ success: true, message: `Recurso ${novoStatus ? 'ativado' : 'desativado'}`, novoStatus });
});

// ==================== NOTÍCIAS ADMIN ====================
router.get('/noticias', async (req, res) => {
    const { status } = req.query;
    let where = {};
    if (status) where.status = status;
    const noticias = await prisma.noticia.findMany({
        where,
        orderBy: { data_publicacao: 'desc' },
        include: { autor: { select: { email: true } } }
    });
    res.json(noticias);
});

router.get('/noticias/:id', async (req, res) => {
    const { id } = req.params;
    const noticia = await prisma.noticia.findUnique({ where: { id }, include: { autor: { select: { email: true } } } });
    if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });
    res.json(noticia);
});

router.post('/noticias', async (req, res) => {
    const { titulo, conteudo, status, data_agendamento, etapa_educacional } = req.body;
    const data = {
        titulo,
        conteudo,
        status: status || 'rascunho',
        data_agendamento: data_agendamento ? new Date(data_agendamento) : null,
        etapa_educacional,
        autor: { connect: { id: req.userId } }
    };
    if (status === 'publicado') {
        data.data_publicacao = new Date();
    }
    const nova = await prisma.noticia.create({ data });
    res.status(201).json(nova);
});

router.put('/noticias/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo, status, data_agendamento, etapa_educacional } = req.body;
    const noticiaExistente = await prisma.noticia.findUnique({ where: { id } });
    const atualizada = await prisma.noticia.update({
        where: { id },
        data: {
            titulo,
            conteudo,
            status,
            data_agendamento: data_agendamento ? new Date(data_agendamento) : null,
            etapa_educacional,
            data_atualizacao: new Date(),
            data_publicacao: status === 'publicado' && !noticiaExistente.data_publicacao ? new Date() : undefined
        }
    });
    res.json(atualizada);
});

router.post('/noticias/:id/publicar', async (req, res) => {
    const { id } = req.params;
    const noticia = await prisma.noticia.update({
        where: { id },
        data: { status: 'publicado', data_publicacao: new Date() }
    });
    res.json(noticia);
});

router.post('/noticias/:id/arquivar', async (req, res) => {
    const { id } = req.params;
    const noticia = await prisma.noticia.update({
        where: { id },
        data: { status: 'arquivado' }
    });
    res.json(noticia);
});

router.delete('/noticias/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.noticia.delete({ where: { id } });
    res.json({ success: true });
});

// ==================== USUÁRIOS ADMIN ====================
router.get('/usuarios', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const [usuarios, total] = await Promise.all([
            prisma.usuario.findMany({
                skip: offset,
                take: limit,
                orderBy: { data_cadastro: 'desc' },
                select: { id: true, email: true, cidade: true, estado: true, tipo: true, data_cadastro: true }
            }),
            prisma.usuario.count()
        ]);
        res.json({ usuarios, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

router.post('/usuarios/:id/alterar-nivel', async (req, res) => {
    const { id } = req.params;
    const { nivel_acesso } = req.body; // 'usuario', 'editor', 'moderador', 'superadmin'
    const niveisValidos = ['usuario', 'editor', 'moderador', 'superadmin'];
    if (!niveisValidos.includes(nivel_acesso)) {
        return res.status(400).json({ error: 'Nível inválido' });
    }
    const isAdmin = nivel_acesso !== 'usuario';
    try {
        await prisma.usuario.update({
            where: { id },
            data: { tipo: nivel_acesso, is_admin: isAdmin }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao alterar nível' });
    }
});

// ==================== LOGs ADMIN ====================
router.get('/logs', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { tipo, usuarioId, dataInicio, dataFim } = req.query;
    
    let where = {};
    if (tipo) where.tipo_log = tipo;
    if (usuarioId) where.usuario_id = usuarioId;
    if (dataInicio || dataFim) {
        where.data_log = {};
        if (dataInicio) where.data_log.gte = new Date(dataInicio);
        if (dataFim) where.data_log.lte = new Date(dataFim);
    }
    
    try {
        const [logs, total] = await Promise.all([
            prisma.sistemaLog.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { data_log: 'desc' },
                include: { usuario: { select: { email: true } } }
            }),
            prisma.sistemaLog.count({ where })
        ]);
        res.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar logs' });
    }
});

// ==================== RELATÓRIOS ADMIN ====================
router.get('/reports/recursos-por-etapa', async (req, res) => {
    const recursos = await prisma.recurso.findMany({ where: { ativo: true }, select: { etapa: true } });
    const map = new Map();
    recursos.forEach(r => {
        const etapas = r.etapa.split(',');
        etapas.forEach(etapa => {
            map.set(etapa, (map.get(etapa) || 0) + 1);
        });
    });
    const data = Array.from(map.entries()).map(([etapa, total]) => ({ etapa, total }));
    res.json(data);
});

router.get('/reports/usuarios-por-etapa', async (req, res) => {
    const usuarios = await prisma.usuario.groupBy({
        by: ['etapa_preferida'],
        _count: { id: true }
    });
    const data = usuarios.map(u => ({ etapa: u.etapa_preferida || 'Não informado', total: u._count.id }));
    res.json(data);
});

module.exports = router;