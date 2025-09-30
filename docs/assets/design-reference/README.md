# Design Reference - BlockAI Style

Este diretório contém as imagens de referência do design **BlockAI**, que servem como base visual para o projeto ControlFin.

## 📁 Conteúdo

As imagens `split_1.jpg` até `split_9.jpg` fazem parte de um único design completo que foi dividido em seções. Todas devem ser consideradas em conjunto para entender o sistema de design completo.

## 🎨 Características do Design

### Paleta de Cores Extraída
- **Background Principal:** `#2d3561` (azul-roxo escuro profundo)
- **Background Sidebar:** `#1f2347` (azul muito escuro)
- **Background Cards:** `#363d65` (azul médio escuro)
- **Accent Primário:** `#00d9ff` (ciano elétrico)
- **Accent Secundário:** `#2196f3` (azul royal)
- **Texto Principal:** `#ffffff` (branco)
- **Texto Secundário:** `#a0a4b8` (cinza azulado claro)
- **Success:** `#00ff88` (verde neon)
- **Error/Danger:** `#ff3366` (vermelho vibrante)
- **Warning:** `#ffaa00` (laranja)

### Elementos Visuais

#### Layout
- **Sidebar vertical** fixa à esquerda (largura ~240px)
- **Fundo escuro** com gradiente sutil
- **Cards flutuantes** com sombras leves e bordas sutis
- **Glassmorphism** discreto em alguns elementos

#### Tipografia
- **Fonte:** Google Fonts (gratuitas) - Recomendado: Inter, Poppins ou Roboto
- **Pesos:** 
  - 300 (Light) - Textos secundários
  - 400 (Regular) - Corpo do texto
  - 600 (Semibold) - Títulos e destaques

#### Componentes
- **Tabelas:** Estilo moderno com linhas sutis, paginação azul
- **Gráficos:** Highcharts com cores vibrantes e gradientes
- **Botões:** Preenchidos (ciano `#00d9ff`) ou outline (borda ciano)
- **Ícones:** Outline style, monocromáticos
- **Badges:** Arredondados, cores vibrantes
- **Inputs:** Fundo `#363d65`, borda sutil, focus com glow ciano

## 🖼️ Páginas de Referência

### split_1.jpg - Landing Page / Overview
- Logo BlockAI
- Apresentação do template
- Stack tecnológica (React + Vite, SASS, Ant Design 5, Highcharts)
- Paleta de cores em destaque
- Preview do dashboard

### split_2.jpg - Color System
- Círculos de paleta (Accent, Typography, Background)
- Google Fonts destacadas
- Features (Fully Responsive, Major Browsers, Customizable, W3C Valide)

### split_3.jpg - Additional Features
- Well Organized
- Customizable Charts
- Google Fonts
- Vector Based Design
- Documentação detalhada

### split_4.jpg - AI Search Engine (Página #1)
- Sidebar com menu lateral
- Painel de busca com ícones coloridos
- Tabela de "Available accounts" com múltiplas colunas
- Paginação inferior

### split_5.jpg - Watchlist (Página #2)
- Tabs (My Watchlist, Details)
- Filtros avançados
- Tabela detalhada com dados financeiros
- Ícones de ação (estrela, notificação)

### split_6.jpg - Token Explorer (Página #3)
- Cards de tokens com mini-gráficos (sparklines)
- Tabs (Token Explorer, Pool Explorer)
- Tabela com dados de mercado
- Sort options

### split_7.jpg - Token Explorer (continuação)
- Mais linhas da tabela
- Paginação
- Dados detalhados (preços, mudanças percentuais, market cap)

### split_8.jpg - Additional Information (Página #4)
- Seção de redes sociais (Twitter, Telegram, Discord, LinkedIn, Medium)
- Formulário de contato (Contact form)
- Twitter feed integrado
- Termos e condições
- Legal notice

### split_9.jpg - Settings (Página #5)
- Configurações de perfil
- Preferências gerais
- Notificações (Email, Slack, Discord, Telegram, Twitter)
- Privacy policies

## 🚀 Como Usar

### Com Gemini 2.5 Pro (Multimodal)
Você pode usar o Gemini 2.5 Pro no Cursor para converter partes do design em código:

```
@model gemini-2.5-pro

[Anexe uma das imagens split_X.jpg]

Converta este design em código React + Ant Design + SCSS seguindo o PROJECT_BRIEF.md.

Requisitos:
- Cores exatas do design BlockAI
- Componentes Ant Design 5
- Responsive (mobile, tablet, desktop)
- Tipografia com Google Fonts
- Animações suaves

Forneça componente React + SCSS.
```

### Referência Rápida
Para qualquer dúvida sobre cores, espaçamento ou estilo, consulte estas imagens como fonte de verdade do design visual.

## 📝 Notas

- As imagens estão em JPEG e podem ter pequenos artefatos de compressão
- Use ferramentas como eyedropper/color picker para extrair cores exatas se necessário
- O design é responsivo - considere breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1920px (large)
- Priorize fidelidade visual ao design apresentado

---

**Atualizado em:** 30 de Setembro de 2025  
**Fonte:** Template BlockAI Admin Crypto Trading Dashboard
