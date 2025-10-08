<div align="center">
  <!-- TODO: Adicionar um logo para o ControlFin -->
  <h1 align="center">ControlFin</h1>
  <p align="center">
    Um PWA moderno e seguro para controle de finanças pessoais e compartilhadas.
  </p>
</div>

<br />

<!-- BADGES -->
<div align="center">
  <!-- CI/CD Status -->
  <a href="https://github.com/seu-usuario/controlfin-frontend/actions/workflows/ci.yml">
    <img src="https://github.com/seu-usuario/controlfin-frontend/actions/workflows/ci.yml/badge.svg" alt="CI Status Frontend">
  </a>
  <a href="https://github.com/seu-usuario/controlfin-backend/actions/workflows/ci.yml">
    <img src="https://github.com/seu-usuario/controlfin-backend/actions/workflows/ci.yml/badge.svg" alt="CI Status Backend">
  </a>
  <!-- License -->
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
</div>

---

## 📜 Sobre o Projeto

O **ControlFin** é um Progressive Web App (PWA) projetado para simplificar a gestão de finanças, seja individualmente ou em casal. Através de "Espaços Financeiros" colaborativos, os usuários podem rastrear transações, planejar orçamentos, definir metas de economia e visualizar seus dados financeiros de forma clara e intuitiva.

A aplicação é construída com uma abordagem _mobile-first_, garantindo uma experiência de usuário otimizada em qualquer dispositivo, com suporte a instalação e funcionalidades offline básicas.

> **Nota:** Este projeto está atualmente em desenvolvimento.

<!-- TODO: Adicionar link para o deploy quando estiver disponível -->

**[➡️ Acesse a demonstração ao vivo](https://controlfin.vercel.app)**

### ✨ Screenshots

<!-- TODO: Adicionar screenshots da aplicação quando a UI estiver mais avançada. -->
<!-- As imagens de referência do design estão em /docs/assets/design-reference/ -->
<div align="center">
  <img src="/docs/assets/design-reference/split_4.jpg" width="400" alt="Dashboard Screenshot">
  <img src="/docs/assets/design-reference/split_6.jpg" width="400" alt="Cards Screenshot">
</div>

---

## 🚀 Funcionalidades (MVP)

- **👥 Gestão Colaborativa:** Crie um "Espaço Financeiro" e convide outra pessoa para gerenciar as finanças em conjunto.
- **💸 Transações Completas:** CRUD completo para receitas e despesas, com categorização, método de pagamento e status.
- **💳 Cartões de Crédito:** Cadastre cartões, associe despesas e visualize a fatura consolidada.
- **📊 Orçamento (Budget):** Defina metas de gastos por categoria ou um teto geral e acompanhe o progresso em tempo real.
- **🎯 Metas de Economia:** Crie metas de longo prazo (ex: "Viagem") e registre os aportes para acompanhar a evolução.
- **📈 Dashboard Analítico:** Tenha uma visão geral do seu saldo, receitas, despesas e principais categorias de gastos.
- **🔔 Alertas e Notificações:** Receba alertas sobre orçamentos próximos do limite e lembretes de contas a pagar.
- **📱 PWA e Offline:** Instale o ControlFin no seu dispositivo e acesse suas informações mesmo sem internet.

---

## 🛠️ Stack Tecnológico

O projeto é um monorepo contendo dois pacotes principais: `controlfin-frontend` e `controlfin-backend`.

| Área           | Tecnologia          | Justificativa                                                  |
| :------------- | :------------------ | :------------------------------------------------------------- |
| **Frontend**   | **React 18**        | Ecossistema maduro e performance com renderização concorrente. |
|                | **TypeScript**      | Garante segurança de tipos e melhora a DX.                     |
|                | **Vite**            | Build tool extremamente rápido para desenvolvimento.           |
|                | **Ant Design 5**    | Biblioteca de UI completa, com tema escuro customizado.        |
|                | **Zustand**         | Gerenciamento de estado simples, leve e poderoso.              |
|                | **SASS/SCSS**       | Para estilos modulares e manuteníveis.                         |
| **Backend**    | **Node.js 22+**     | Permite o uso de JavaScript/TypeScript em todo o stack.        |
|                | **Fastify**         | Framework web focado em alta performance e baixo overhead.     |
|                | **MongoDB**         | Banco de dados NoSQL flexível, ideal para iteração rápida.     |
|                | **Zod**             | Validação de schemas com inferência de tipos para TypeScript.  |
|                | **JWT**             | Autenticação stateless com Access e Refresh Tokens.            |
| **Testes**     | **Vitest**          | Framework de testes rápido e compatível com Vite.              |
| **CI/CD**      | **GitHub Actions**  | Automação de lint, testes e deploy.                            |
| **Hospedagem** | **Vercel & Render** | Plataformas otimizadas para deploy de frontend e backend.      |

---

## 🏁 Começando

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- Node.js (v22 ou superior)
- Git

### Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/seu-usuario/controlFin.git
   cd controlFin
   ```

2. Instale as dependências para ambos os pacotes:

   ```sh
   # No diretório raiz (controlFin/)
   npm install

   # Navegue para cada pacote e instale suas dependências específicas
   cd controlfin-frontend && npm install
   cd ../controlfin-backend && npm install
   cd ..
   ```

### Configuração de Ambiente

1. **Backend:**
   - Navegue até `controlfin-backend`.
   - Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
   - Preencha as variáveis de ambiente, especialmente `MONGODB_URI` e as chaves do Google OAuth.

2. **Frontend:**
   - Navegue até `controlfin-frontend`.
   - Copie o arquivo `.env.example` para `.env`.
   - Certifique-se de que `VITE_API_BASE_URL` aponta para a URL do seu backend local (padrão: `http://localhost:3000/api`).

### Executando o Projeto

Você precisará de dois terminais abertos para executar o frontend e o backend simultaneamente.

1. **Terminal 1: Iniciar o Backend**

   ```sh
   cd controlfin-backend
   npm run dev
   ```

   O servidor da API estará rodando em `http://localhost:3000`.

2. **Terminal 2: Iniciar o Frontend**
   ```sh
   cd controlfin-frontend
   npm run dev
   ```
   A aplicação estará acessível em `http://localhost:5173`.

---

## 🚧 Status do Projeto

O projeto está sendo desenvolvido seguindo o roadmap definido no `PROJECT_BRIEF.md`.

- [x] **Fase 1: Fundação** (Setup do projeto, CI/CD, estrutura base)
- [ ] **Fase 2: Autenticação** (Login/Registro com E-mail e Google)
- [ ] **Fase 3: Espaços Financeiros** (Criação e convite)
- [ ] ... (demais fases do roadmap)

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Para garantir a qualidade do código, por favor, siga estas diretrizes:

1. Faça um **Fork** do projeto.
2. Crie uma nova branch para sua feature (`git checkout -b feature/MinhaFeature`).
3. Siga os padrões de código definidos no `.eslintrc.cjs` e `.prettierrc`.
4. Faça o commit de suas mudanças com mensagens semânticas (ex: `feat(auth): add password recovery`).
5. Abra um **Pull Request** para a branch `develop`.

Para mais detalhes sobre a arquitetura e padrões, consulte o **PROJECT_BRIEF.md**.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

<!-- Test comment for docs changes -->

<!-- Test comment for docs changes -->

<!-- Test comment for docs changes -->

<!-- Test comment for docs changes -->
