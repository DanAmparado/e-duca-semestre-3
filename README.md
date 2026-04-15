# E-DUCA - Plataforma Educacional

E-DUCA é uma plataforma que democratiza o acesso à educação, conectando alunos a recursos educacionais, notícias e recomendações personalizadas. Desenvolvido com Node.js, React, Prisma e MongoDB.

## Pré-requisitos

- Node.js (v18 ou superior)
- npm (v9+)
- MongoDB Atlas (ou MongoDB local)
- Git

## Como executar o projeto localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/e-duca.git
cd e-duca
```
### 2. Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```env

DATABASE_URL="sua_string_de_conexao_mongodb"
JWT_SECRET="um_segredo_forte_para_jwt"
PORT=3000
```
    Importante: Substitua sua_string_de_conexao_mongodb pela URL do seu banco MongoDB Atlas ou local. Exemplo:
    mongodb+srv://usuario:senha@cluster.mongodb.net/e-duca-semestre-3?retryWrites=true&w=majority

### 3. Instale as dependências
```bash
# Backend (raiz do projeto)
npm install

# Frontend React
cd frontend-react
npm install
cd ..
```
### 4. Configure o Prisma e popule o banco de dados
```bash
# Gera o cliente Prisma
npx prisma generate

# Executa o seed (cria usuários, recursos e notícias de exemplo)
npx prisma db seed
```
O script de seed criará automaticamente:

    Usuário administrador: admin@educa.com / admin123

    Usuário comum: usuario@exemplo.com / senha123

    Recursos e notícias de exemplo para demonstração.

### 5. Inicie o servidor backend
```bash
npm run dev
```
O backend estará disponível em http://localhost:3000.

### 6. Inicie o frontend React
```bash
cd frontend-react
npm run dev
```
O frontend estará disponível em http://localhost:5173.

# Acessando o sistema
Perfil	E-mail	Senha
Administrador	admin@educa.com	admin123
Usuário comum	usuario@exemplo.com	senha123
# Testes (opcional)

Se você implementou testes automatizados, execute:
```bash
# Backend
npm test

# Frontend
cd frontend-react
npm run test
```
### Estrutura do projeto
```text
e-duca/
├── backend/                # API REST (Node.js + Express + Prisma)
│   ├── api/v1/             # Rotas com autenticação JWT
│   ├── middleware/         # jwtAuth e permissões
│   ├── models/             # Models do Prisma
│   └── lib/                # Configuração do Prisma Client
├── frontend-react/         # Aplicação React (Vite)
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas (Home, Login, Admin, etc.)
│   │   └── services/       # Configuração do Axios
├── prisma/                 # Schema do banco e script de seed
│   ├── schema.prisma
│   └── seed.js
└── .env                    # Variáveis de ambiente (não versionado)
```

# Tecnologias utilizadas

    Backend: Node.js, Express, Prisma ORM, MongoDB Atlas, JWT, bcrypt

    Frontend: React, Vite, Axios, React Router, React Hot Toast, Recharts

    Ferramentas: ESLint, Prettier, Git

# Notas importantes

    O projeto utiliza soft delete para recursos (campo ativo) – itens inativos não aparecem na listagem pública, mas podem ser restaurados pelo admin.

    A autenticação é baseada em JWT – o frontend armazena o token no localStorage e o envia no header Authorization: Bearer <token>.

    O backend é uma API REST pura – não há mais renderização de views (EJS) ou sessões.

# Contribuição

Este projeto foi desenvolvido para o 3º semestre da FATEC (Desenvolvimento de Software Multiplataforma). Contribuições são bem-vindas via pull requests.

# Licença

MIT
