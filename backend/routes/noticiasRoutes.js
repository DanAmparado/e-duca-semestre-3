const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');

router.get('/', noticiasController.listarTodos);
router.get('/:id', noticiasController.detalhesNoticia);
router.get('/teste', (req, res) => {
    res.send('Rota de teste funcionando');
});

module.exports = router;