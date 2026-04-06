const prisma = require('../lib/prisma');

class Recurso {
    static async buscarTodos(apenasAtivos = true, limit = 100, offset = 0) {
        try {
            const where = apenasAtivos ? { ativo: true } : {};
            return await prisma.recurso.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { data_criacao: 'desc' }
            });
        } catch (error) {
            console.error('Erro em Recurso.buscarTodos:', error);
            throw error;
        }
    }

    static async buscarPorId(id) {
        try {
            return await prisma.recurso.findUnique({ where: { id } });
        } catch (error) {
            console.error('Erro em Recurso.buscarPorId:', error);
            throw error;
        }
    }

    static async buscarPorEtapa(etapa, apenasAtivos = true) {
        try {
            const where = {
                etapa: { contains: etapa },
                ...(apenasAtivos && { ativo: true })
            };
            return await prisma.recurso.findMany({
                where,
                orderBy: { data_criacao: 'desc' }
            });
        } catch (error) {
            console.error('Erro em Recurso.buscarPorEtapa:', error);
            throw error;
        }
    }
    static async buscarPorTermo(termo, apenasAtivos = true) {
        try {
            const where = {
                OR: [
                    { titulo: { contains: termo } },
                    { descricao: { contains: termo } },
                    { etapa: { contains: termo } }
                ],
                ...(apenasAtivos && { ativo: true })
            };
            return await prisma.recurso.findMany({
                where,
                orderBy: { titulo: 'asc' }
            });
        } catch (error) {
            console.error('Erro em Recurso.buscarPorTermo:', error);
            throw error;
        }
    }

    static async criar(dados) {
        try {
            const novo = await prisma.recurso.create({
                data: {
                    titulo: dados.titulo,
                    descricao: dados.descricao || null,
                    link_externo: dados.link_externo || null,
                    etapa: dados.etapa,
                    ativo: dados.ativo !== undefined ? dados.ativo : true,
                    aprovado: dados.aprovado !== undefined ? dados.aprovado : false,
                    data_moderacao: dados.data_moderacao || null,
                    autor_id: dados.autor_id,
                    data_criacao: new Date(),
                    data_atualizacao: new Date()
                }
            });
            return novo;
        } catch (error) {
            console.error('Erro em Recurso.criar:', error);
            throw error;
        }
    }

    static async atualizar(id, dados) {
        try {
            const atualizado = await prisma.recurso.update({
                where: { id },
                data: {
                    ...dados,
                    data_atualizacao: new Date()
                }
            });
            return atualizado;
        } catch (error) {
            console.error('Erro em Recurso.atualizar:', error);
            throw error;
        }
    }

    static async desativar(id) {
        try {
            return await prisma.recurso.update({
                where: { id },
                data: { ativo: false, data_atualizacao: new Date() }
            });
        } catch (error) {
            console.error('Erro em Recurso.desativar:', error);
            throw error;
        }
    }

    static async ativar(id) {
        try {
            return await prisma.recurso.update({
                where: { id },
                data: { ativo: true, data_atualizacao: new Date() }
            });
        } catch (error) {
            console.error('Erro em Recurso.ativar:', error);
            throw error;
        }
    }

    static async excluirPermanentemente(id) {
        try {
            await prisma.recurso.delete({ where: { id } });
            return true;
        } catch (error) {
            console.error('Erro em Recurso.excluirPermanentemente:', error);
            throw error;
        }
    }

    static async buscarPendentes() {
        try {
            return await prisma.recurso.findMany({
                where: {
                    OR: [
                        { ativo: false },
                        { aprovado: false }
                    ]
                },
                orderBy: { data_criacao: 'asc' }
            });
        } catch (error) {
            console.error('Erro em Recurso.buscarPendentes:', error);
            throw error;
        }
    }
    static async contar(filtro = {}) {
        return await prisma.recurso.count({ where: filtro });
    }

    static async listarPaginado(filtro = {}, limit = 10, offset = 0, orderBy = { data_criacao: 'desc' }) {
        const recursos = await prisma.recurso.findMany({
            where: filtro,
            skip: offset,
            take: limit,
            orderBy
        });
        const total = await prisma.recurso.count({ where: filtro });
        return { recursos, total };
    }

    static async buscarPendentes(limit = 5) {
        return await prisma.recurso.findMany({
            where: { OR: [{ ativo: false }, { aprovado: false }] },
            orderBy: { data_criacao: 'asc' },
            take: limit
        });
    }
}

module.exports = Recurso;