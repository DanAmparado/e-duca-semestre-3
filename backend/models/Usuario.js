const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

class Usuario {
    static async criar(usuario) {
        try {
            const hashedPassword = await bcrypt.hash(usuario.senha, 10);
            const novoUsuario = await prisma.usuario.create({
                data: {
                    email: usuario.email,
                    senha: hashedPassword,
                    cidade: usuario.cidade || null,
                    estado: usuario.estado || null,
                    etapa_preferida: usuario.etapa_preferida || null,

                }
            });
            return novoUsuario;
        } catch (error) {
            console.error('Erro em Usuario.criar:', error);
            throw error;
        }
    }

    static async buscarPorEmail(email) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { email }
            });
            return usuario;
        } catch (error) {
            console.error('Erro em Usuario.buscarPorEmail:', error);
            throw error;
        }
    }

    static async validarSenha(senha, senhaHash) {
        return await bcrypt.compare(senha, senhaHash);
    }

    static async contar(filtro = {}) {
        return await prisma.usuario.count({ where: filtro });
    }

    static async contarAdmins() {
        return await prisma.usuario.count({ where: { is_admin: true } });
    }

    static async buscarRecentes(dias = 7, limit = 5) {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - dias);
        return await prisma.usuario.findMany({
            where: { data_cadastro: { gte: dataLimite } },
            orderBy: { data_cadastro: 'desc' },
            take: limit
        });
    }

    static async listarPaginado(limit, offset, orderBy = { data_cadastro: 'desc' }) {
        const usuarios = await prisma.usuario.findMany({
            skip: offset,
            take: limit,
            orderBy
        });
        const total = await prisma.usuario.count();
        return { usuarios, total };
    }

    static async buscarTodos(filtro = {}, orderBy = { data_cadastro: 'desc' }) {
        return await prisma.usuario.findMany({ where: filtro, orderBy });
    }

    static async buscarPorId(id) {
        try {
            return await prisma.usuario.findUnique({
                where: { id }
            });
        } catch (error) {
            console.error('Erro em Usuario.buscarPorId:', error);
            throw error;
        }
    }

    static async atualizar(id, dados) {
        try {
            if (dados.senha) {
                const bcrypt = require('bcrypt');
                dados.senha = await bcrypt.hash(dados.senha, 10);
            }
            const usuarioAtualizado = await prisma.usuario.update({
                where: { id },
                data: {
                    ...dados,
                    data_atualizacao: new Date()
                }
            });
            return usuarioAtualizado;
        } catch (error) {
            console.error('Erro em Usuario.atualizar:', error);
            throw error;
        }
    }
}

module.exports = Usuario;