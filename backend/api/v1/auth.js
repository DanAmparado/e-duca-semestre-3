const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../../middleware/jwtAuth');

const JWT_SECRET = process.env.JWT_SECRET || 'educa-jwt-secret-change-this';

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    try {
        const usuario = await Usuario.buscarPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const senhaValida = await Usuario.validarSenha(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email, tipo: usuario.tipo },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ 
            token, 
            user: { 
                id: usuario.id, 
                email: usuario.email, 
                tipo: usuario.tipo,
                is_admin: usuario.is_admin
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/register', async (req, res) => {
    const { email, senha, cidade, estado, etapa_preferida } = req.body;
    try {
        const novoUsuario = await Usuario.criar({ email, senha, cidade, estado, etapa_preferida });
        res.status(201).json({ message: 'Usuário criado com sucesso', userId: novoUsuario.id });
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

router.get('/perfil', jwtAuth, async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorId(req.userId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const { senha, ...perfil } = usuario;
        res.json(perfil);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
});

router.put('/perfil', jwtAuth, async (req, res) => {
    const { cidade, estado, etapa_preferida } = req.body;
    try {
        const usuarioAtualizado = await Usuario.atualizar(req.userId, {
            cidade: cidade || null,
            estado: estado || null,
            etapa_preferida: etapa_preferida || null
        });
        const { senha, ...perfil } = usuarioAtualizado;
        res.json(perfil);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
});

router.put('/alterar-senha', jwtAuth, async (req, res) => {
    const { senhaAtual, novaSenha } = req.body;
    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }
    try {
        const usuario = await Usuario.buscarPorId(req.userId);
        const senhaValida = await Usuario.validarSenha(senhaAtual, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }
        await Usuario.atualizar(req.userId, { senha: novaSenha });
        res.json({ success: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao alterar senha' });
    }
});

module.exports = router;