const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // 1. Criar usuário admin
  const adminEmail = 'admin@educa.com';
  const adminExistente = await prisma.usuario.findUnique({ where: { email: adminEmail } });
  if (!adminExistente) {
    const senhaHash = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
      data: {
        email: adminEmail,
        senha: senhaHash,
        is_admin: true,
        tipo: 'superadmin',
        cidade: 'São Paulo',
        estado: 'SP',
        etapa_preferida: 'Superior'
      }
    });
    console.log('Admin criado: admin@educa.com / admin123');
  } else {
    console.log('Admin já existe, pulando criação.');
  }

  // 2. Criar usuário comum
  const userEmail = 'usuario@exemplo.com';
  const userExistente = await prisma.usuario.findUnique({ where: { email: userEmail } });
  if (!userExistente) {
    const senhaHash = await bcrypt.hash('senha123', 10);
    await prisma.usuario.create({
      data: {
        email: userEmail,
        senha: senhaHash,
        is_admin: false,
        tipo: 'usuario',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        etapa_preferida: 'Medio'
      }
    });
    console.log('Usuário comum criado: usuario@exemplo.com / senha123');
  } else {
    console.log('Usuário comum já existe, pulando criação.');
  }

  // 3. Adicionar recursos de exemplo
  const recursosExemplo = [
    {
      titulo: 'Khan Academy - Matemática',
      descricao: 'Plataforma gratuita com videoaulas e exercícios de matemática para todos os níveis.',
      link_externo: 'https://pt.khanacademy.org/',
      etapa: 'Basico,Fundamental,Medio,Superior',
      ativo: true,
      aprovado: true,
      autor_id: adminExistente ? adminExistente.id : (await prisma.usuario.findUnique({ where: { email: adminEmail } })).id
    },
    {
      titulo: 'Curso em Vídeo - Python',
      descricao: 'Curso gratuito de Python do professor Gustavo Guanabara.',
      link_externo: 'https://www.cursoemvideo.com/curso/python-3-mundo-1/',
      etapa: 'Medio,Tecnico,Superior',
      ativo: true,
      aprovado: true,
      autor_id: adminExistente ? adminExistente.id : (await prisma.usuario.findUnique({ where: { email: adminEmail } })).id
    }
  ];

  for (const recurso of recursosExemplo) {
    const existente = await prisma.recurso.findFirst({ where: { titulo: recurso.titulo } });
    if (!existente) {
      await prisma.recurso.create({ data: recurso });
      console.log(`Recurso criado: ${recurso.titulo}`);
    } else {
      console.log(`Recurso "${recurso.titulo}" já existe, pulando.`);
    }
  }

  // 4. Notícia de exemplo
  const noticiaExistente = await prisma.noticia.findFirst({ where: { titulo: 'Bem-vindo ao E-DUCA!' } });
  if (!noticiaExistente) {
    await prisma.noticia.create({
      data: {
        titulo: 'Bem-vindo ao E-DUCA!',
        conteudo: 'Esta é uma plataforma educacional para democratizar o acesso a recursos de qualidade. Use o usuário admin para gerenciar conteúdos.',
        status: 'publicado',
        data_publicacao: new Date(),
        etapa_educacional: 'Geral',
        autor_id: adminExistente ? adminExistente.id : (await prisma.usuario.findUnique({ where: { email: adminEmail } })).id
      }
    });
    console.log('Notícia de exemplo criada.');
  } else {
    console.log('Notícia de exemplo já existe.');
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });