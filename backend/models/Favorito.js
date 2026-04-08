const prisma = require('../lib/prisma');

class Favorito {
    static async adicionar(usuario_id, recurso_id) {
        try {
            return await prisma.favorito.create({
                data: { usuario_id, recurso_id }
            });
        } catch (error) {
            if (error.code === 'P2002') {
                // já existe favorito, ignorar
                return null;
            }
            throw error;
        }
    }

    static async remover(usuario_id, recurso_id) {
        try {
            await prisma.favorito.delete({
                where: {
                    usuario_id_recurso_id: { usuario_id, recurso_id }
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    static async listarPorUsuario(usuario_id) {
        try {
            const favoritos = await prisma.favorito.findMany({
                where: { usuario_id },
                include: { recurso: true },
                orderBy: { createdAt: 'desc' }
            });
            return favoritos.map(f => f.recurso);
        } catch (error) {
            console.error('Erro ao listar favoritos:', error);
            return [];
        }
    }

    static async isFavorito(usuario_id, recurso_id) {
        const fav = await prisma.favorito.findUnique({
            where: { usuario_id_recurso_id: { usuario_id, recurso_id } }
        });
        return !!fav;
    }

    static async obterIdsFavoritos(usuario_id) {
        const favs = await prisma.favorito.findMany({
            where: { usuario_id },
            select: { recurso_id: true }
        });
        return favs.map(f => f.recurso_id);
    }
}

module.exports = Favorito;