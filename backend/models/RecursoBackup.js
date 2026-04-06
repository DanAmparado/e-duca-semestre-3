const prisma = require('../lib/prisma');

class RecursoBackup {
    static async criar(dados) {
        try {
            const backup = await prisma.recursoBackup.create({
                data: {
                    recurso_id: dados.recurso_id,
                    dados_anteriores: dados.dados_anteriores,
                    usuario_id: dados.usuario_id,
                    motivo: dados.motivo,
                    data_backup: new Date()
                }
            });
            return backup;
        } catch (error) {
            console.error('Erro em RecursoBackup.criar:', error);
            throw error;
        }
    }

    static async buscarPorRecurso(recursoId, limit = 10) {
        try {
            return await prisma.recursoBackup.findMany({
                where: { recurso_id: recursoId },
                orderBy: { data_backup: 'desc' },
                take: limit
            });
        } catch (error) {
            console.error('Erro em RecursoBackup.buscarPorRecurso:', error);
            throw error;
        }
    }

    static async buscarPorId(id) {
        try {
            return await prisma.recursoBackup.findUnique({ where: { id } });
        } catch (error) {
            console.error('Erro em RecursoBackup.buscarPorId:', error);
            throw error;
        }
    }

    static async restaurar(backupId, recursoModel) {
        try {
            const backup = await this.buscarPorId(backupId);
            if (!backup) throw new Error('Backup não encontrado');

            const recursoAtualizado = await recursoModel.atualizar(backup.recurso_id, {
                ...backup.dados_anteriores,
                data_moderacao: new Date()
            });
            return recursoAtualizado;
        } catch (error) {
            console.error('Erro em RecursoBackup.restaurar:', error);
            throw error;
        }
    }
}

module.exports = RecursoBackup;