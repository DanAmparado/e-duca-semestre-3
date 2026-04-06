const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');
const Usuario = require('../models/Usuario');
const Noticia = require('../models/Noticia');
const SistemaLog = require('../models/SistemaLog');
const Recurso = require('../models/Recurso');
const noticiasController = require('../controllers/noticiasController');

router.use(auth);

router.get('/', adminAuth.requireEditor, adminController.dashboard);
router.get('/dashboard', adminAuth.requireEditor, adminController.dashboard);
router.get('/relatorios', adminAuth.requireEditor, adminController.relatorios);

router.get('/usuarios', adminAuth.requireSuperAdmin, adminController.listarUsuarios);
router.post('/usuarios/:id/alterar-nivel', adminAuth.requireSuperAdmin, adminController.alterarNivelAcesso);

router.get('/recursos', adminAuth.requireEditor, adminController.listarRecursos);
router.get('/recursos/criar', adminAuth.requireEditor, adminController.formularioCriarRecurso);
router.post('/recursos/criar', adminAuth.requireEditor, adminController.criarRecurso);
router.get('/recursos/editar/:id', adminAuth.requireEditor, adminController.formularioEditarRecurso);
router.post('/recursos/editar/:id', adminAuth.requireEditor, adminController.atualizarRecurso);
router.post('/recursos/:id/toggle', adminAuth.requireEditor, adminController.toggleRecursoStatus);

router.delete('/recursos/excluir/:id', adminAuth.requireModerador, adminController.excluirRecurso);
router.post('/recursos/restaurar/:id', adminAuth.requireModerador, adminController.restaurarRecurso);

router.get('/noticias', adminAuth.requireEditor, noticiasController.adminListar);
router.get('/noticias/criar', adminAuth.requireEditor, noticiasController.formularioCriar);
router.post('/noticias/criar', adminAuth.requireEditor, noticiasController.criar);
router.get('/noticias/editar/:id', adminAuth.requireEditor, noticiasController.formularioEditar);
router.post('/noticias/editar/:id', adminAuth.requireEditor, noticiasController.atualizar);
router.post('/noticias/:id/publicar', adminAuth.requireEditor, noticiasController.publicar);
router.post('/noticias/:id/arquivar', adminAuth.requireEditor, noticiasController.arquivar);
router.post('/noticias/excluir/:id', adminAuth.requireModerador, noticiasController.excluir);

router.get('/sistema/logs', adminAuth.requireModerador, async (req, res) => {
    try {
        const logs = await SistemaLog.buscarTodos(100, 0);
        res.render('admin/sistema/logs', {
            user: req.session.user,
            logs
        });
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
        res.status(500).render('pages/erro', {
            erro: 'Erro interno do servidor',
            user: req.session.user
        });
    }
});

router.get('/api/dashboard/stats', adminAuth.requireEditor, async (req, res) => {
    try {
        const total_usuarios = await Usuario.contar();
        const recursos_ativos = await Recurso.contar({ ativo: true });
        const recursos_inativos = await Recurso.contar({ ativo: false });
        const noticias_publicadas = await Noticia.contar({ status: 'publicado' });

        res.json({ total_usuarios, recursos_ativos, recursos_inativos, noticias_publicadas });
    } catch (error) {
        console.error('Erro ao buscar stats:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/api/recursos/pendentes', adminAuth.requireEditor, async (req, res) => {
    try {
        const recursos = await Recurso.buscarPendentes(10);
        res.json(recursos);
    } catch (error) {
        console.error('Erro ao buscar recursos pendentes:', error);
        res.status(500).json({ error: 'Erro interno' });
    }
});

router.get('/api/relatorios', adminAuth.requireEditor, adminController.apiRelatorios);

router.get('/permissoes', adminAuth.requireSuperAdmin, adminController.listarPermissoes);
router.post('/permissoes/atualizar/:id', adminAuth.requireSuperAdmin, adminController.atualizarPermissoes);

module.exports = router;