const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middleware/auth');

router.get('/perfil', auth, usuariosController.perfil);
router.get('/perfil/editar', auth, usuariosController.formularioEditarPerfil);
router.post('/perfil', auth, usuariosController.atualizarPerfil);
router.get('/recomendacoes', auth, usuariosController.recomendacoes);

module.exports = router;