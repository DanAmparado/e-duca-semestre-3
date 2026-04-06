// scripts/migrate.js
const mysql = require('mysql2/promise');
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

// Configuração do MySQL (ajuste conforme seu ambiente local)
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'educa',
};

async function migrate() {
  let connection;
  try {
    console.log('📡 Conectando ao MySQL...');
    connection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Conectado ao MySQL');

    // Mapeamentos de IDs antigos para novos ObjectId
    const userMap = new Map(); // old_user_id -> new_user_id (string)
    const resourceMap = new Map(); // old_recurso_id -> new_recurso_id (string)

    // ---------------------- 1. Migrar Usuários ----------------------
    console.log('\n👥 Migrando usuários...');
    const [users] = await connection.execute(`
      SELECT id, email, senha, cidade, estado, etapa_preferida,
             data_cadastro, is_admin, nivel_acesso, ultimo_login
      FROM usuarios
    `);
    for (const user of users) {
      const newUser = await prisma.usuario.create({
        data: {
          email: user.email,
          senha: user.senha,
          cidade: user.cidade || undefined,
          estado: user.estado || undefined,
          etapa_preferida: user.etapa_preferida || undefined,
          data_cadastro: user.data_cadastro,
          data_atualizacao: user.data_cadastro, // valor inicial
          is_admin: user.is_admin === 1,
          tipo: user.nivel_acesso, // superadmin, moderador, editor, usuario
          ultimo_login: user.ultimo_login || undefined,
        },
      });
      userMap.set(user.id, newUser.id);
      console.log(`  → Usuário ${user.email} (old id ${user.id}) -> ${newUser.id}`);
    }

    // ---------------------- 2. Migrar Recursos ----------------------
    console.log('\n📚 Migrando recursos...');
    // Define o autor padrão: o primeiro superadmin (old id 1 ou 12)
    const defaultAuthorId = userMap.get(1) || userMap.get(12);
    if (!defaultAuthorId) throw new Error('Nenhum superadmin encontrado para ser autor padrão');

    const [resources] = await connection.execute(`
      SELECT id, titulo, descricao, link_externo, etapa,
             data_criacao, ativo, data_moderacao
      FROM recursos
    `);
    for (const res of resources) {
      const newResource = await prisma.recurso.create({
        data: {
          titulo: res.titulo,
          descricao: res.descricao || undefined,
          link_externo: res.link_externo || undefined,
          etapa: res.etapa,
          ativo: res.ativo === 1,
          aprovado: res.ativo === 1, // campos aprovado = ativo (por não haver aprovado no MySQL)
          data_moderacao: res.data_moderacao || undefined,
          autor_id: defaultAuthorId, // todos os recursos passam a ter o superadmin como autor
          data_criacao: res.data_criacao,
          data_atualizacao: res.data_criacao,
        },
      });
      resourceMap.set(res.id, newResource.id);
      console.log(`  → Recurso "${res.titulo}" (old id ${res.id}) -> ${newResource.id}`);
    }

    // ---------------------- 3. Migrar Backups de Recursos ----------------------
    console.log('\n💾 Migrando backups de recursos...');
    const [backups] = await connection.execute(`
      SELECT id, recurso_id, dados_anteriores, usuario_id, data_backup, motivo
      FROM recursos_backup
    `);
    for (const backup of backups) {
      const newRecursoId = resourceMap.get(backup.recurso_id);
      const newUsuarioId = userMap.get(backup.usuario_id);
      if (!newRecursoId || !newUsuarioId) {
        console.warn(`  ⚠️ Backup ${backup.id} ignorado: recurso_id ${backup.recurso_id} ou usuario_id ${backup.usuario_id} não encontrado`);
        continue;
      }
      await prisma.recursoBackup.create({
        data: {
          recurso_id: newRecursoId,
          dados_anteriores: backup.dados_anteriores,
          usuario_id: newUsuarioId,
          motivo: backup.motivo,
          data_backup: backup.data_backup,
        },
      });
      console.log(`  → Backup ${backup.id} (recurso ${backup.recurso_id})`);
    }

    // ---------------------- 4. Migrar Logs do Sistema ----------------------
    console.log('\n📝 Migrando logs do sistema...');
    const [logs] = await connection.execute(`
      SELECT id, tipo_log, usuario_id, acao, descricao,
             ip_address, user_agent, metadata, data_log
      FROM sistema_logs
    `);
    for (const log of logs) {
      const newUsuarioId = userMap.get(log.usuario_id);
      if (!newUsuarioId) {
        console.warn(`  ⚠️ Log ${log.id} ignorado: usuario_id ${log.usuario_id} não encontrado`);
        continue;
      }
      await prisma.sistemaLog.create({
        data: {
          tipo_log: log.tipo_log,
          usuario_id: newUsuarioId,
          acao: log.acao,
          descricao: log.descricao || undefined,
          ip_address: log.ip_address || undefined,
          user_agent: log.user_agent || undefined,
          metadata: log.metadata || undefined,
          data_log: log.data_log,
        },
      });
      console.log(`  → Log ${log.id} (usuário ${log.usuario_id})`);
    }

    // ---------------------- 5. Migrar Notícias (se houver) ----------------------
    console.log('\n📰 Migrando notícias...');
    const [news] = await connection.execute(`
      SELECT id, titulo, conteudo, data_publicacao, status,
             data_agendamento, autor_id, etapa_educacional
      FROM noticias
    `);
    for (const item of news) {
      const newAutorId = userMap.get(item.autor_id);
      if (!newAutorId) {
        console.warn(`  ⚠️ Notícia ${item.id} ignorada: autor_id ${item.autor_id} não encontrado`);
        continue;
      }
      await prisma.noticia.create({
        data: {
          titulo: item.titulo,
          conteudo: item.conteudo,
          status: item.status,
          data_agendamento: item.data_agendamento || undefined,
          etapa_educacional: item.etapa_educacional || undefined,
          autor_id: newAutorId,
          data_publicacao: item.data_publicacao,
          data_atualizacao: item.data_publicacao,
        },
      });
      console.log(`  → Notícia "${item.titulo}" (autor ${item.autor_id})`);
    }

    console.log('\n🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    if (connection) await connection.end();
    await prisma.$disconnect();
  }
}

migrate();