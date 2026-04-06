const prisma = require('../lib/prisma');

class SistemaLog {
    static async registrar(dados) {
        try {
            const log = await prisma.sistemaLog.create({
                data: {
                    tipo_log: dados.tipo_log,
                    usuario_id: dados.usuario_id,
                    acao: dados.acao,
                    descricao: dados.descricao || null,
                    ip_address: dados.ip_address || null,
                    user_agent: dados.user_agent || null,
                    metadata: dados.metadata || null,
                    data_log: new Date()
                }
            });
            return log;
        } catch (error) {
            console.error('Erro em SistemaLog.registrar:', error);
            throw error;
        }
    }

    static async buscarPorTipo(tipo, limit = 100, offset = 0) {
        try {
            return await prisma.sistemaLog.findMany({
                where: { tipo_log: tipo },
                skip: offset,
                take: limit,
                orderBy: { data_log: 'desc' }
            });
        } catch (error) {
            console.error('Erro em SistemaLog.buscarPorTipo:', error);
            throw error;
        }
    }

    static async buscarPorUsuario(usuarioId, limit = 100, offset = 0) {
        try {
            return await prisma.sistemaLog.findMany({
                where: { usuario_id: usuarioId },
                skip: offset,
                take: limit,
                orderBy: { data_log: 'desc' }
            });
        } catch (error) {
            console.error('Erro em SistemaLog.buscarPorUsuario:', error);
            throw error;
        }
    }

    static async buscarTodos(limit = 100, offset = 0) {
        try {
            return await prisma.sistemaLog.findMany({
                skip: offset,
                take: limit,
                orderBy: { data_log: 'desc' },
                include: { usuario: true }
            });
        } catch (error) {
            console.error('Erro em SistemaLog.buscarTodos:', error);
            throw error;
        }
    }

    static async contarTotal() {
        try {
            return await prisma.sistemaLog.count();
        } catch (error) {
            console.error('Erro em SistemaLog.contarTotal:', error);
            throw error;
        }
    }
}

module.exports = SistemaLog;