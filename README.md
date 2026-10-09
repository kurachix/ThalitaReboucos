# Thalita Rebouças: Universo Interativo & Ateliê Biográfico 💖✨

Bem-vindo ao projeto do **Site Biográfico Hiper-Interativo de Thalita Rebouças**, uma das autoras mais queridas da literatura infanto-juvenil e pop brasileira, com mais de 25 livros publicados, mais de 2,3 milhões de exemplares vendidos, adaptações campeãs de bilheteria e streaming (Netflix, Prime Video, Globoplay) e histórico de maratonas recordistas na Bienal do Livro.

Este projeto rompe definitivamente o modelo enciclopédico convencional, transformando a trajetória da autora em um **diário digital vivo, lúdico, sensorial e 100% interativo**, inspirado na estética *scrapbook* carioca, cadernos colegiais personalizados e física tátil.

---

## 🌟 Os 7 Atos da Experiência Hiper-Interativa



### 1. Ato 1: O Ateliê da Autora (Hero Screen)
- **Mesa de Datilografia Retrô**: Máquina de escrever interativa que reage a toques e teclas físicas do teclado para datilografar o manifesto da autora com feedback sonoro de máquina mecânica e rolo móvel.
- **Óculos de Cores Mutáveis (SVG Interativo)**: Troca instantânea da cor da armação clássica da autora (*Rosa Choque, Amarelo Neon, Roxo Elétrico, Turquesa Mar*) com adaptação cromática dos títulos e botões.
- **Estatísticas Editoriais em Pílulas**: Leitores (+2,3M), Livros (+25), Filmes (5) e Maratonas da Bienal (+12h).
- **Botões Magnéticos**: Atração suave ao cursor do mouse no desktop.

### 2. Ato 2: Álbum de Figurinhas de Memórias (Linha do Tempo)
- **Carrossel Snap com Aceleração por GPU**: Da infância no Rio de Janeiro nos anos 70, graduação em Jornalismo na PUC-Rio e 20 cartas de recusas de editoras, até o estouro nacional e o Top 1 Global da Netflix.
- **Polaroids com Física 3D Tilt**: Inclinação dinâmica baseada na posição do cursor do mouse, carimbos postais e legendas manuscritas autênticas.
- **Navegador Rápido de Anos**: Trilho de botões que salta diretamente para o marco histórico desejado.

### 3. Ato 3: A Estante Pop Tridimensional (Catálogo Literário)
- **Mais de 25 Livros Modelados em Lombadas Realistas**: Variações orgânicas de espessura, cores editoriais autênticas (*Série Fala Sério!, Universo Popstar, Série Confissões, Romances & Crônicas*) e textura de verniz localizado.
- **Filtros por Coleção & Busca em Tempo Real**: Filtre por categoria ou pesquise instantaneamente por título, tema ou personagem.
- **Leitor Aberto Flipbook 3D (Spread Aberto)**: Modal com perspectiva 3D profunda, costura da lombada, marcador de página em fita de cetim, ficha catalográfica oficial, sinopse, degustação do 1º capítulo e citação marcante com botão de cópia.

### 4. Ato 4: Cine-Thalita & Streaming (Do Papel para as Telas)
- **Claquete Interativa Articulada**: Haste móvel com física de arraste (*Pointer Events*) ou clique que bate no batente inferior com som estalado (*CLACK! AÇÃO! 🎬*).
- **Projetor de Cinema 35mm com Feixe de Luz Volumétrico**: Acende um feixe de luz que ilumina a tela de projeção e a obra ativa.
- **Carrossel de Obras Audiovisuais**: *Fala Sério, Mãe!* (2017), *Tudo por um Popstar* (2018), *Ela Disse, Ele Disse* (2019), *Pai em Dobro* (2021) e *Confissões de uma Garota Excluída* (2021).
- **TrailerModal Lightbox**: Reprodutor sob demanda de trailer oficial do YouTube e curiosidades contadas pela Thalita.

### 5. Ato 5: Máquina de Conselhos Pop (Caça-Níquel & Gerador de Cards)
- **Dispensador Vintage de Pílulas Afetivas**: Alavanca mecânica puxável que gira 3 tambores (*Tema, Livro e Amuleto*) com física de mola e efeitos sonoros mecânicos.
- **Conselho Sorteado**: Cápsula que se abre revelando a frase de humor, autógrafo digital e botão de cópia.
- **Gerador de Cards para Redes Sociais (Canvas HTML5 HD)**: Estúdio em tempo real que exporta o conselho em **9:16 (Instagram Stories/Reels)** ou **1:1 (Feed/WhatsApp)** em resolução nativa 1080p, com opções de temas de cores cariocas, cópia direta da imagem para a área de transferência e compartilhamento nativo (*Web Share API*).

### 6. Ato 6: Mini-Jogo de Afinidade ("Qual Personagem É Você?")
- **Dilema das Heroínas**: Mini-quiz em formato de bilhete escolar passado por baixo da carteira com 3 perguntas dinâmicas e cálculo determinístico por pesos de afinidade (*Malu, Tetê, Gabi ou Davi*).
- **Explosão de Confetes**: Celebração visual festiva via `canvas-confetti` na tela de revelação do resultado com características marcantes e frase icônica.

### 7. Ato 7: Mural dos Fãs & Bienal Nostalgia (Parede de Cortiça)
- **Parede de Cortiça Texturizada com Moldura Rústica**: Post-its realistas nas cores Amarelo, Rosa, Azul, Menta e Lilás com rotações orgânicas (-3° a 4°), efeito pendular (*pendulum hover*) e alfinetes 3D com brilho especular.
- **Memórias das Maratonas de 12 Horas de Autógrafos**: Polaroids históricas da Bienal do Livro.
- **Formulário de Novo Recado com Persistência**: Adicione seu nome, cidade, livro marcante e mensagem afetuosa (máx. 140 chars) com sanitização de texto, som de alfinete espetando a cortiça e persistência automática no `localStorage`.

---

## 🎨 Sistemas Transversais & Arquitetura Técnica

### Microinterações & Adesivos
- **Botões Magnéticos (`MagneticButton.tsx`)**: Atração suave ao cursor do mouse em botões primários no desktop com retorno elástico, desativados automaticamente em touch screens.
- **Adesivos Holográficos Arrastáveis (`FloatingSticker.tsx` / `FloatingStickersLayer.tsx`)**: Adesivos pop (*"Fala Sério!"*, *"Tudo por um Popstar"*, *"Recorde 12h Bienal"*, *"Carioca da Gema"*) que podem ser arrastados livremente pela tela com efeito holográfico furacão e reposicionados a qualquer momento.

### Sound Design (Áudio Interativo)
- **SoundPill**: Botão flutuante no cabeçalho com equalizador animado por CSS acelerado por GPU.
- **Mudo por Padrão (Strict Opt-in)**: Em estrita conformidade com as políticas dos navegadores, a experiência começa silenciada e só emite sons após ativação explícita pelo usuário.
- **Síntese Web Audio API**: Sintetizador nativo sem dependência de arquivos externos pesados (cliques táteis, virar de páginas, teclar da máquina de escrever, alavanca e impacto da claquete).

### Acessibilidade Inclusiva (WCAG 2.1 AA)
- **Modo de Movimento Reduzido**: Suporte nativo à preferência do sistema operacional (`prefers-reduced-motion: reduce`) e alternador manual no Header. Substitui giros 3D e rotações por fades suaves e transições discretas.
- **Navegação por Teclado**: Foco visual nítido (`:focus-visible` com anel rosa choque de 3px), atalho universal `Escape` para fechar modais e setas do teclado para folhear livros.
- **Link Skip to Content**: Atalho `.skip-to-content` no topo da página acessível via tecla `Tab`.
- **Atributos ARIA Semânticos**: Uso rigoroso de `role="dialog"`, `aria-modal="true"`, `aria-live="polite"` e rótulos `aria-label` descritivos.

### Performance 60-120 FPS & Otimizações Mobile
- **Hardware Tiering (`use-device-capability.ts`)**: Detecção de conexões lentas (2G/3G) e dispositivos modestos (`hardwareConcurrency <= 4` ou `deviceMemory <= 4`), desativando filtros `backdrop-blur` intensivos para poupar GPU e bateria.
- **Renderização Sob Demanda (`content-visibility: auto`)**: Seções abaixo da dobra têm layout calculado apenas quando próximas da viewport.
- **Zero Tap Delay**: `touch-action: manipulation;` e `-webkit-tap-highlight-color: transparent;` para toque instantâneo em smartphones.
- **Suporte a Safe Area Inset**: Prevenção de sobreposição com entalhes de tela e Dynamic Island no iOS/Android.

### SEO Estruturado Schema.org
- **Metatags Completas**: Open Graph e Twitter Cards otimizadas com imagens e metadados canônicos.
- **JSON-LD Schema.org**: Catálogo estruturado da entidade `Person` (Thalita Rebouças), com links `sameAs` oficiais (Instagram, Twitter, TikTok, Wikipedia, IMDb), catálogo de obras `Book` e adaptações `Movie`.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
- **Node.js** 18.x ou superior
- **npm** 9.x ou superior

### Passo a Passo

1. **Clone o repositório ou acesse a pasta**:
   ```bash
   cd c:\Repositorio\ThalitaReboucos
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a URL informada no terminal (geralmente `http://localhost:5173/`).

4. **Para gerar o build de produção**:
   ```bash
   npm run build
   ```

5. **Para visualizar o bundle de produção**:
   ```bash
   npm run preview
   ```
   Servido em `http://localhost:4173/`.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: TypeScript 5.7+ (Strict Mode)
- **Framework & Bundler**: React 18 + Vite 6
- **Estilização**: Tailwind CSS + Modern CSS Variables
- **Ícones**: Lucide React
- **Gerenciamento de Estado**: Zustand
- **Efeitos de Partículas**: Canvas-Confetti
- **Exportação de Mídia**: HTML5 Native Canvas API
- **Arquitetura de Regras**: Diretório `.agents/` (AGENTS.md, Rules e Skills)

---

## 💖 Créditos & Homenagem

Criado com todo o afeto carioca para celebrar o legado transformador de **Thalita Rebouças** na vida de milhões de jovens leitores.
*(C) Universo Thalita Rebouças · Experiência Digital 100% Interativa.*
