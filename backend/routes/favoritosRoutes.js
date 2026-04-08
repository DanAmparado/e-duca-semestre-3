const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const auth = require('../middleware/auth');

// Todas as rotas exigem login
router.use(auth);

router.get('/', favoritosController.listar);
router.post('/:id/adicionar', favoritosController.adicionar);
router.delete('/:id/remover', favoritosController.remover);
router.get('/check/:id', favoritosController.check);

module.exports = router;