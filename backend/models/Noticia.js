const prisma = require('../lib/prisma');

class Noticia {
    static async buscarTodos(apenasPublicadas = true, limit = 100, offset = 0) {
        try {
            const where = apenasPublicadas ? { status: 'publicado' } : {};
            return await prisma.noticia.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { data_publicacao: 'desc' }
            });
        } catch (error) {
            console.error('Erro em Noticia.buscarTodos:', error);
            throw error;
        }
    }

    static async buscarPorId(id) {
        try {
            return await prisma.noticia.findUnique({ where: { id } });
        } catch (error) {
            console.error('Erro em Noticia.buscarPorId:', error);
            throw error;
        }
    }

    static async buscarPorEtapa(etapa, apenasPublicadas = true) {
        try {
            const where = {
                etapa_educacional: etapa,
                ...(apenasPublicadas && { status: 'publicado' })
            };
            return await prisma.noticia.findMany({
                where,
                orderBy: { data_publicacao: 'desc' }
            });
        } catch (error) {
            console.error('Erro em Noticia.buscarPorEtapa:', error);
            throw error;
        }
    }

    static async criar(dados) {
        try {
            let dataAgendamento = dados.data_agendamento;
            if (dataAgendamento && !(dataAgendamento instanceof Date)) {
                dataAgendamento = null;
            }
            const nova = await prisma.noticia.create({
                data: {
                    titulo: dados.titulo,
                    conteudo: dados.conteudo,
                    status: dados.status || 'rascunho',
                    data_agendamento: dataAgendamento,
                    etapa_educacional: dados.etapa_educacional || null,
                    autor_id: dados.autor_id,
                    data_publicacao: dados.data_publicacao || new Date(),
                    data_atualizacao: new Date()
                }
            });
            return nova;
        } catch (error) {
            console.error('Erro em Noticia.criar:', error);
            throw error;
        }
    }

    static async atualizar(id, dados) {
        try {
            const atualizada = await prisma.noticia.update({
                where: { id },
                data: {
                    ...dados,
                    data_atualizacao: new Date()
                }
            });
            return atualizada;
        } catch (error) {
            console.error('Erro em Noticia.atualizar:', error);
            throw error;
        }
    }

    static async publicar(id) {
        try {
            return await prisma.noticia.update({
                where: { id },
                data: { status: 'publicado', data_atualizacao: new Date() }
            });
        } catch (error) {
            console.error('Erro em Noticia.publicar:', error);
            throw error;
        }
    }

    static async arquivar(id) {
        try {
            return await prisma.noticia.update({
                where: { id },
                data: { status: 'arquivado', data_atualizacao: new Date() }
            });
        } catch (error) {
            console.error('Erro em Noticia.arquivar:', error);
            throw error;
        }
    }

    static async excluir(id) {
        try {
            await prisma.noticia.delete({ where: { id } });
            return true;
        } catch (error) {
            console.error('Erro em Noticia.excluir:', error);
            throw error;
        }
    }

    static async contar(filtro = {}) {
        return await prisma.noticia.count({ where: filtro });
    }
    
    static async listarPaginado(filtro = {}, limit = 10, offset = 0, orderBy = { data_publicacao: 'desc' }) {
        const noticias = await prisma.noticia.findMany({
            where: filtro,
            skip: offset,
            take: limit,
            orderBy
        });
        const total = await prisma.noticia.count({ where: filtro });
        return { noticias, total };
    }
}

module.exports = Noticia;