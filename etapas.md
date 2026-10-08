# 🗺️ Roteiro de Desenvolvimento: Universo Thalita Rebouças
## Guia de Execução em 34 Etapas Modulares (24 Fundamentais + 10 Atualizações de Experiência e Qualidade)

> **Estratégia de Engenharia**: Este documento divide a criação e evolução contínua do site biográfico hiper-interativo de **Thalita Rebouças** em etapas incrementais e atômicas. As 24 primeiras etapas estabeleceram a fundação completa e os 7 atos da experiência, enquanto a **Fase 9 (Etapas 25 a 34)** traz 10 atualizações profundas focadas em refinamento de qualidade, feedback sensorial e interação direta do usuário com a plataforma.

---

## 📊 Matriz de Fases do Projeto

| Fase | Descrição | Etapas |
| :--- | :--- | :--- |
| **Fase 1** | Fundação, Tooling, Tokens e Dados Estruturados | Etapas 01 a 04 |
| **Fase 2** | Arquitetura Sensorial & Shell da Aplicação | Etapas 05 a 07 |
| **Fase 3** | O Ateliê da Autora & Linha do Tempo em Figurinhas | Etapas 08 a 10 |
| **Fase 4** | Obras Literárias & Cine-Thalita | Etapas 11 a 14 |
| **Fase 5** | Gamificação Pop & Máquina de Conselhos | Etapas 15 a 17 |
| **Fase 6** | Mural dos Fãs & Comunidade de Leitores | Etapas 18 a 19 |
| **Fase 7** | Acessibilidade, Performance 60 FPS & Polimento | Etapas 20 a 22 |
| **Fase 8** | SEO Biográfico Schema.org & Validação Final | Etapas 23 a 24 |
| **Fase 9** | Refinamento de Qualidade & Interação Usuário ➔ Plataforma | Etapas 25 a 34 |

---

## 🚀 FASE 1: Fundação, Tooling, Tokens e Dados Estruturados

### [x] Etapa 01: Inicialização do Workspace e Configuração da Stack
- **Objetivo**: Inicializar o projeto com TypeScript Strict Mode, empacotador veloz (Vite ou Next.js), Tailwind CSS e bibliotecas de ícones/utilitários essenciais (`lucide-react`, `clsx`, `tailwind-merge`).
- **Arquivos-chave**: `package.json`, `tsconfig.json`, `vite.config.ts` (ou `next.config.js`), `tailwind.config.js`.
- **Critério de Aceite**: Projeto compila em tempo recorde (`npm run dev` limpo), sem erros de tipagem e com hot reload funcional.
- **Otimização para o Modelo**: Não instalar pacotes desnecessários; manter o `package.json` enxuto.

### [x] Etapa 02: Design Tokens, Tipografia e Paleta de Cores Carioca
- **Objetivo**: Integrar fontes do Google Fonts (`Outfit` / `Poppins`, `Plus Jakarta Sans`, `Caveat` para manuscritos) e configurar tokens de cores solares, sombras de scrapbook, texturas de papel pautado e bordas adesivas.
- **Arquivos-chave**: `src/index.css` (ou `src/app/globals.css`), `tailwind.config.js`.
- **Critério de Aceite**: Variáveis CSS disponíveis (`--color-sun-yellow`, `--color-pop-pink`, `--color-sea-blue`, `--font-handwriting`), renderização correta de classes utilitárias e pré-visualização de fontes no navegador.
- **Otimização para o Modelo**: Definir tokens no CSS uma única vez para evitar classes arbitrárias repetitivas no JSX.

### [x] Etapa 03: Tipagem Estrita e Modelagem de Dados Biográficos
- **Objetivo**: Criar os contratos TypeScript e os repositórios de dados estáticos para biografia, livros, filmes, conselhos e quiz baseados no acervo oficial.
- **Arquivos-chave**: `src/types/index.ts`, `src/data/biography.ts`, `src/data/books.ts`, `src/data/movies.ts`, `src/data/advices.ts`, `src/data/quiz.ts`.
- **Critério de Aceite**: Tipos estritos para cada entidade (`Book`, `Movie`, `TimelineMilestone`, `AdviceQuote`, `QuizQuestion`) sem uso de `any`.
- **Otimização para o Modelo**: Concentrar todo o acervo em arquivos dedicados na pasta `src/data/`, deixando os componentes focados 100% em visual e interatividade.

### [x] Etapa 04: Gerenciamento de Estado Global com Zustand
- **Objetivo**: Criar o store leve para gerenciar o estado da aplicação: controle de áudio (*mute/unmute*), livro selecionado para leitura, adesivos colecionados desbloqueados e modal ativo.
- **Arquivos-chave**: `src/store/use-app-store.ts`.
- **Critério de Aceite**: Store exportando `useAppStore` com ações reativas (`toggleAudio`, `openBookModal`, `collectSticker`), com estado inicial mudo (`isMuted: true`).
- **Otimização para o Modelo**: Store minimalista sem boilerplate denso, facilitando a injeção em múltiplos componentes.

---

## 🎵 FASE 2: Arquitetura Sensorial & Shell da Aplicação

### [x] Etapa 05: Sound Engine Tátil (Áudio Interativo & Web Audio / Howler)
- **Objetivo**: Implementar o motor de efeitos sonoros táteis (clique de tecla, folhear de página, puxada de alavanca, aplausos) e trilha sonora ambiente lo-fi com suporte a Web Audio API / Howler.js.
- **Arquivos-chave**: `src/hooks/use-audio.ts`, `src/utils/sound-effects.ts`.
- **Critério de Aceite**: Os sons só disparam após interação do usuário (*user gesture*); respeita rigorosamente a flag de silêncio global `isMuted`.
- **Otimização para o Modelo**: Sintetizar sons via Web Audio API como fallback para não depender obrigatoriamente de arquivos externos pesados de áudio.

### [x] Etapa 06: Barra de Navegação Flutuante & Pílula Sonora ("Sound Pill")
- **Objetivo**: Construir o header fixo/flutuante com logotipo estilizado de Thalita, links de navegação suave entre atos biográficos e o botão de áudio interativo com equalizador animado em CSS.
- **Arquivos-chave**: `src/components/common/Header.tsx`, `src/components/audio/SoundPill.tsx`.
- **Critério de Aceite**: Barra translúcida com glassmorphism, indicador animado de áudio que oscila quando ativo e se contrai quando mudo, clique com feedback visual.
- **Otimização para o Modelo**: Manter o componente autocontido com classes utilitárias diretas.

### [x] Etapa 07: Shell Responsivo, Texturas de Fundo e Layout Base
- **Objetivo**: Criar a casca principal da aplicação com container responsivo, padrão sutil de caderno pautado/quadriculado, detalhes de adesivos e microgrid de alinhamento.
- **Arquivos-chave**: `src/components/layout/AppShell.tsx`, `src/App.tsx` (ou `src/app/page.tsx`).
- **Critério de Aceite**: Layout responsivo perfeito em resoluções de 320px até 4K; rolagem suave sem quebra de overflow horizontal indesejado.
- **Otimização para o Modelo**: Estabelecer a marcação estrutural de todas as 7 seções com IDs claros (`#hero`, `#timeline`, `#bookshelf`, `#cinema`, `#advices`, `#quiz`, `#fan-wall`).

---

## 🎨 FASE 3: O Ateliê da Autora & Linha do Tempo em Figurinhas

### [x] Etapa 08: Hero Screen — O Ateliê Carioca da Thalita
- **Objetivo**: Implementar a seção Hero com estética de mesa de trabalho de escritora: cores solares do Rio, iluminação suave, óculos coloridos interativos e apresentação carismática.
- **Arquivos-chave**: `src/components/hero/HeroSection.tsx`, `src/components/hero/GlassesColorPicker.tsx`.
- **Critério de Aceite**: Ao passar o cursor ou tocar nos óculos da Thalita, eles alternam entre 4 cores clássicas (Rosa Choque, Amarelo Neon, Roxo, Turquesa) com microanimação de mola.
- **Otimização para o Modelo**: Dividir o Hero em subcomponentes para evitar arquivos gigantescos.

### [x] Etapa 09: Máquina de Escrever Interativa com Efeito de Digitação
- **Objetivo**: Construir a máquina de escrever retrô onde o usuário pode clicar nas teclas (ou pressionar o teclado físico) emitindo som de máquina e digitando a frase-manifesto da autora na folha de papel.
- **Arquivos-chave**: `src/components/hero/Typewriter.tsx`.
- **Critério de Aceite**: Animação de cada letra surgindo na folha em fonte mono/typewriter, som tátil sincronizado e botão de "Concluir Frase" automática.
- **Otimização para o Modelo**: Controlar o loop de texto via `useEffect` limpo com cleanup para evitar memory leaks.

### [x] Etapa 10: Linha do Tempo em Álbum de Figurinhas de Memórias
- **Objetivo**: Criar a linha do tempo biográfica em formato de álbum com polaroids inclinadas, carimbos da Bienal e cartões de memórias (1974 a 2024+).
- **Arquivos-chave**: `src/components/timeline/TimelineSection.tsx`, `src/components/timeline/PolaroidCard.tsx`.
- **Critério de Aceite**: Efeito de *tilt 3D* suave nas polaroids ao mover o mouse; scroll horizontal fluido em desktop e carrossel magnético no celular; aviãozinho de papel interativo animado.
- **Otimização para o Modelo**: Usar transformações CSS (`transform-style: preserve-3d`) leves sem pesar a GPU.

---

## 📚 FASE 4: Obras Literárias & Cine-Thalita

### [x] Etapa 11: Estante Pop Tridimensional — Catálogo e Filtros
- **Objetivo**: Construir a estante de livros moderna com prateleiras estilizadas e sistema de filtros em pílulas ("Todos", "Fala Sério!", "Popstar", "Confissões", "Infantis").
- **Arquivos-chave**: `src/components/bookshelf/BookshelfSection.tsx`, `src/components/bookshelf/BookSpine.tsx`, `src/components/bookshelf/CategoryFilter.tsx`.
- **Critério de Aceite**: Filtragem instantânea sem reload, animação suave de reorganização dos livros na estante via Framer Motion / CSS Transitions.
- **Otimização para o Modelo**: Estruturar a renderização dos livros usando `key` estável baseada no slug do livro.

### [x] Etapa 12: Leitor & Flipbook de Livros (Modal de Experiência Imersiva)
- **Objetivo**: Desenvolver o modal de abertura do livro selecionado em formato de livro aberto: página esquerda com capa e estatísticas editoriais; página direita com sinopse, citação e bastidores contados pela autora.
- **Arquivos-chave**: `src/components/bookshelf/BookFlipbookModal.tsx`.
- **Critério de Aceite**: Animação realista de abertura e fechamento de capa; tecla `ESC` fecha o modal; botão de fechar com feedback de clique e trava de scroll no fundo (`overflow: hidden`).
- **Otimização para o Modelo**: Usar portal React (`createPortal`) ou modal nativo com controle de foco e acessibilidade.

### [x] Etapa 13: Claquete Interativa de Cinema
- **Objetivo**: Criar o componente de claquete de cinema onde o usuário puxa e solta a haste móvel (drag ou clique), disparando a animação de batida com som de *CLACK!*.
- **Arquivos-chave**: `src/components/cinema/Clapperboard.tsx`.
- **Critério de Aceite**: A batida da claquete acende um feixe de luz de projetor de cinema que destaca o filme selecionado na seção.
- **Otimização para o Modelo**: Isolar a física de rotação da claquete usando estados simples de mola no Framer Motion (`rotate: [0, -25, 0]`).

### [x] Etapa 14: Cine-Thalita — Carrossel de Filmes e Bastidores das Telas
- **Objetivo**: Apresentar os 5 filmes adaptados das obras de Thalita (Netflix, Prime Video, Cinema), com elenco, sinopse, recordes de bilheteria e modal/aba com curiosidades e trailers.
- **Arquivos-chave**: `src/components/cinema/CinemaSection.tsx`, `src/components/cinema/MovieCard.tsx`, `src/components/cinema/TrailerModal.tsx`.
- **Critério de Aceite**: Navegação fluida entre os filmes, badges de streaming (Netflix / Prime Video / Cinema), reprodução de trailer ou teaser oficial em lightbox acessível.
- **Otimização para o Modelo**: Evitar iframes pesados pré-carregados; usar carregamento sob demanda do vídeo apenas ao clicar em "Assistir Trailer".

---

## 🎰 FASE 5: Gamificação Pop & Máquina de Conselhos

### [x] Etapa 15: Máquina de Conselhos da Thalita (Caça-Níquel Pop)
- **Objetivo**: Construir a máquina estilo caça-níquel/roleta vintage de chicletes com alavanca acionável para sortear pílulas de humor e conselhos afetivos dos livros da autora.
- **Arquivos-chave**: `src/components/advice-machine/AdviceMachineSection.tsx`, `src/components/advice-machine/SlotReels.tsx`.
- **Critério de Aceite**: Ao acionar a alavanca, cilindros giram com efeito de desfoque de movimento (*blur*) e som de roleta; cápsula se abre exibindo o conselho sorteado e a assinatura de Thalita.
- **Otimização para o Modelo**: Gerar a animação de rotação com keyframes de translação rápida finalizando com desaceleração cúbica suave (`cubic-bezier`).

### [x] Etapa 16: Gerador de Cards de Conselho para Redes Sociais
- **Objetivo**: Implementar a funcionalidade de exportação do conselho sorteado em formato de card estilizado (9:16 para Instagram Stories e 1:1 para feed/WhatsApp) com botão de cópia e download.
- **Arquivos-chave**: `src/components/advice-machine/ShareableCard.tsx`, `src/utils/card-generator.ts`.
- **Critério de Aceite**: Card com arte visual impecável, borda scrapbook, autógrafo digital e botão "Copiar Frase" com toast de confirmação.
- **Otimização para o Modelo**: Usar canvas HTML5 nativo ou estilização SVG exportável, evitando bibliotecas externas excessivamente pesadas.

### [x] Etapa 17: Quiz Interativo "Qual Personagem de Thalita Rebouças É Você?"
- **Objetivo**: Desenvolver o mini-jogo de 3 perguntas dinâmicas estilo bilhete escolar ("Malu", "Tetê", "Gabi", "Davi"), com transição de cartões e cálculo automático de afinidade.
- **Arquivos-chave**: `src/components/quiz/QuizSection.tsx`, `src/components/quiz/QuizQuestionCard.tsx`, `src/components/quiz/QuizResultCard.tsx`.
- **Critério de Aceite**: Transições animadas entre perguntas; tela final com resultado personalizado, descrição divertida da personagem e explosão festiva de confetes via `canvas-confetti`.
- **Otimização para o Modelo**: Lógica determinística e pura em `src/data/quiz.ts` com cálculo simples de pontuação por pesos.

---

## 💌 FASE 6: Mural dos Fãs & Comunidade de Leitores

### [x] Etapa 18: Mural dos Fãs da Bienal (Parede de Cortiça Interativa)
- **Objetivo**: Montar o mural de cortiça com post-its coloridos realistas, alfinetes fixadores, recados carinhosos de leitores e fotos históricas das sessões de 12 horas de autógrafos.
- **Arquivos-chave**: `src/components/fan-wall/FanWallSection.tsx`, `src/components/fan-wall/PostItNote.tsx`.
- **Critério de Aceite**: Post-its com rotações orgânicas aleatórias (-3° a 4°), efeito de balanço ao passar o mouse (*pendulum hover*) e sombras que simulam papel descolado da parede.
- **Otimização para o Modelo**: Renderização otimizada com CSS puro para as transformações de rotação e sombra.

### [x] Etapa 19: Formulário Dinâmico de Novo Recado com Persistência
- **Objetivo**: Permitir que o visitante digite seu nome, cidade e mensagem, escolha a cor do post-it (Rosa, Amarelo, Azul, Lilás) e pregue seu recado no mural com som de fixação.
- **Arquivos-chave**: `src/components/fan-wall/AddNoteModal.tsx`, `src/hooks/use-local-notes.ts`.
- **Critério de Aceite**: O novo post-it aparece imediatamente na tela com animação de impacto; notas salvas no `localStorage` para permanecerem ao recarregar a página.
- **Otimização para o Modelo**: Sanitização simples de texto para prevenir injeção de HTML e validação de tamanho de caracteres (máx. 140 chars).

---

## ⚡ FASE 7: Acessibilidade, Performance 60 FPS & Polimento

### [x] Etapa 20: Modo de Movimento Reduzido & Acessibilidade Inclusiva (a11y)
- **Objetivo**: Adaptar todas as animações para o padrão `prefers-reduced-motion: reduce`, adicionar atributos ARIA (`aria-label`, `role="dialog"`, `aria-live`) e assegurar navegação completa por teclado.
- **Arquivos-chave**: `src/hooks/use-reduced-motion.ts`, `src/index.css`.
- **Critério de Aceite**: Com a redução de movimento ativada no sistema operacional, a página substitui transições rápidas e giros 3D por fades suaves e transições discretas sem perder usabilidade.
- **Otimização para o Modelo**: Usar variáveis CSS com fallback condicional para velocidade de animação.

### [x] Etapa 21: Otimização de Performance 60-120 FPS e Auditoria Mobile
- **Objetivo**: Garantir que as animações operem estritamente sobre propriedades GPU-friendly (`transform`, `opacity`), aplicar `will-change` moderadamente, otimizar tamanhos de imagens e auditar taxas de quadros em dispositivos móveis.
- **Arquivos-chave**: Toda a árvore de componentes em `src/components/`.
- **Critério de Aceite**: Zero quedas bruscas de frames (jank); score elevado no Lighthouse; carregamento responsivo sob 3G/4G.
- **Otimização para o Modelo**: Executar revisão sistemática seguindo o checklist da skill `performance-audit-cross-device`.

### [x] Etapa 22: Adesivos Decorativos & Microinterações Magnéticas
- **Objetivo**: Implementar adesivos holográficos arrastáveis pelo usuário (*draggable stickers*) espalhados pela tela e efeito magnético nos botões primários de ação (o botão é atraído suavemente em direção ao cursor).
- **Arquivos-chave**: `src/components/common/MagneticButton.tsx`, `src/components/common/FloatingSticker.tsx`.
- **Critério de Aceite**: Adesivos podem ser arrastados com física natural e soltos em qualquer ponto; botões respondem com suavidade magnética no desktop.
- **Otimização para o Modelo**: Desativar o efeito magnético automaticamente em telas sensíveis ao toque (touch devices) via media query.

---

## 🏆 FASE 8: SEO Biográfico Schema.org & Validação Final

### [x] Etapa 23: SEO Biográfico Estruturado (Schema.org Person / Books) & Metadados
- **Objetivo**: Inserir metatags completas de Open Graph, Twitter Cards e dados estruturados em JSON-LD (`Schema.org/Person`, `CreativeWorkSeries`, `Movie`) com links para perfis oficiais e biografia.
- **Arquivos-chave**: `index.html` (ou `src/app/layout.tsx`), `src/components/seo/StructuredData.tsx`.
- **Critério de Aceite**: Validador de Rich Results do Google reconhece a entidade "Thalita Rebouças" com suas ocupações, obras e mídias sociais.
- **Otimização para o Modelo**: Criar script JSON-LD compacto e sem duplicação de nós.

### [x] Etapa 24: Validação Integrada End-to-End, Build de Produção e Entrega
- **Objetivo**: Executar build de produção (`npm run build`), verificar zero avisos de lint ou TypeScript, testar todos os 7 módulos em navegadores modernos e gerar relatório de entrega.
- **Arquivos-chave**: `dist/` (ou `.next/`), `README.md`.
- **Critério de Aceite**: Build limpo sem erros, todos os links externos funcionando, áudio responsivo, gamificação 100% interativa e documentação atualizada.
- **Otimização para o Modelo**: Executar comando de checagem de tipos (`tsc --noEmit`) antes do empacotamento final.

---

## ✨ FASE 9: Refinamento de Qualidade & Interação Usuário ➔ Plataforma (10 Atualizações de Excelência)

### [x] Etapa 25: Resposta Háptica Mobile e Efeito "Touch Ripple Pop"
- **Objetivo**: Implementar respostas táteis físicas via `navigator.vibrate` em dispositivos móveis compatíveis nas interações-chave (clique das teclas da máquina de escrever, batida da claquete, alavanca do caça-níqueis e fixação do post-it com alfinete) acopladas a uma animação visual de micro-burst de partículas e ondulação elástica (*ripple pop*).
- **Arquivos-chave**: `src/utils/haptics.ts`, `src/components/common/RippleFeedback.tsx`, `src/index.css`.
- **Critério de Aceite**: Em dispositivos móveis suportados, ações de impacto disparam vibração sutil (10-30ms); visualmente, cada toque/clique em botões primários gera feedback expansivo suave com física elástica.
- **Impacto na Interação**: Transforma cliques planos em sensações de toque físico palpável, conectando a interface ao mundo real.

### [x] Etapa 26: Navegação Global por Teclado e Modo Power-User (Atalhos & Quick-Nav)
- **Objetivo**: Criar sistema abrangente de hotkeys globais com modal de ajuda (`[?]`) e anéis de foco inteligentes (`focus-visible`) estilizados com tema pop neon.
- **Arquivos-chave**: `src/hooks/use-keyboard-navigation.ts`, `src/components/common/KeyboardShortcutsModal.tsx`.
- **Critério de Aceite**: Teclas mapeadas: `[M]` alterna áudio mudo/ativo; `[Espaço]` aciona a interação focal da seção em vista (alavanca de conselhos ou claquete); `[J]` / `[K]` ou setas transitam suavemente entre atos biográficos; `[?]` abre o diálogo de atalhos.
- **Impacto na Interação**: Concede agilidade instantânea para usuários frequentes, revisores e eleva o nível de acessibilidade motora sem depender do mouse.

### [ ] Etapa 27: Passaporte da Leitora — Rastreador de Exploração & Gamificação Interativa
- **Objetivo**: Introduzir um "Passaporte / Crachá de Fã" flutuante retrátil que rastreia em tempo real os marcos de interação do usuário (ex: 6 selos: "Datilografou Manifesto", "Girou Caça-Níquel", "Bateu Claquete", "Concluiu Quiz", "Colou Post-It", "Abriu Livro").
- **Arquivos-chave**: `src/components/gamification/ReaderPassport.tsx`, `src/store/use-app-store.ts`, `src/data/achievements.ts`.
- **Critério de Aceite**: Barra discreta ou ícone de passaporte com contagem regressiva/porcentagem (ex: "4/6 experiências vividas"); ao atingir 100%, desbloqueia o carimbo holográfico "Super Fã Oficial da Thalita" com chuva de confetes e mensagem comemorativa exclusiva.
- **Impacto na Interação**: Estimula a curiosidade e incentiva o usuário a explorar e interagir com 100% dos componentes da página.

### [ ] Etapa 28: Cursor Customizado Reativo com Trilha de Brilhos (Desktop Magic Trail)
- **Objetivo**: Implementar cursor estilizado para desktop que assume identidades visuais contextuais conforme a seção percorrida (caneta de autógrafo no Ateliê e Mural, claquete no Cinema, lupa na Estante e dedinho adesivo nos botões).
- **Arquivos-chave**: `src/components/common/CustomCursor.tsx`, `src/hooks/use-cursor-trail.ts`, `src/index.css`.
- **Critério de Aceite**: Rastro suave e ultra-leve de micro-estrelas/brilhos ao mover o mouse; cursor se desativa automaticamente em dispositivos touch e sob `prefers-reduced-motion` sem gerar consumo excessivo de CPU.
- **Impacto na Interação**: Torna a navegação visualmente lúdica, viva e imersiva desde o primeiro milissegundo de uso no computador.

### [ ] Etapa 29: Easter Eggs e Reações Afetivas Dinâmicas da Thalita aos Gestos do Visitante
- **Objetivo**: Inserir gatilhos lúdicos escondidos (como triplo-clique nos óculos da autora, interação com a caneca de café no ateliê ou sequência de teclas especiais) revelando fotos raras de bastidores, mensagens de voz carinhosas ou balões de fala contextuais.
- **Arquivos-chave**: `src/components/hero/EasterEggs.tsx`, `src/components/common/SpeechBubble.tsx`, `src/data/easter-eggs.ts`.
- **Critério de Aceite**: Gatilhos documentados disparam balões de fala bem-humorados no estilo característico de Thalita ("Você achou meu diário secreto!"), com áudio afetivo opcional e efeito sonoro de risada pop.
- **Impacto na Interação**: Cria o sentimento de surpresa, encanto e descoberta orgânica, marcas registradas da literatura infanto-juvenil da autora.

### [ ] Etapa 30: Folheamento Tátil & Leitor com Audiobook Preview nos Livros
- **Objetivo**: Enriquecer o modal de livros (`BookFlipbookModal`) com suporte a gestos touch de arrastar para virar página (*swipe-to-flip*), som aprimorado de folhear papel real e botão interativo "Ouvir Trecho" com síntese de voz (Web Speech API) ou áudio demonstrativo da au
tora.
- **Arquivos-chave**: `src/components/bookshelf/BookFlipbookModal.tsx`, `src/components/bookshelf/AudiobookPlayer.tsx`.
- **Critério de Aceite**: Usuário pode folhear a página clicando nas extremidades ou deslizando horizontalmente no touch; botão de play/pause para ouvir sinopse em áudio com barra de progresso em tempo real; marcador de página interativo que salva os livros favoritos do visitante no `localStorage`.
- **Impacto na Interação**: Eleva o consumo da obra literária para um formato multissensorial (visual, sonoro e gestual).

### [ ] Etapa 31: Seletor Dinâmico de Ambientes Afetivos (Modo Copacabana / Noite de Estreia / Caderno Pastel)
- **Objetivo**: Criar um seletor rápido de ambientação na barra de navegação que altera harmonicamente as variáveis CSS de iluminação, contraste e plano de fundo: "Tarde em Copacabana" (solar/amarelo vivo), "Noite de Estreia" (dark pop/cinema neon) e "Caderno Pastel" (tons suaves de papel pautado).
- **Arquivos-chave**: `src/components/common/ThemeSelector.tsx`, `src/store/use-app-store.ts`, `src/index.css`.
- **Critério de Aceite**: Transição fluida de cor sem piscadas na tela (*no flash*); escolha salva e recuperada automaticamente do `localStorage`; conformidade de contraste WCAG AA mantida em todos os temas.
- **Impacto na Interação**: Dá ao usuário sensação de controle e personalização do próprio ambiente de leitura conforme seu gosto ou horário do dia.

### [ ] Etapa 32: Skeletons Orgânicos & Otimização Preditiva de Latência Zero (Preload on Hover)
- **Objetivo**: Implementar esqueletos de carregamento (*skeleton placeholders*) desenhados no estilo de caderno com efeito de brilho suave para carrosséis e cards, além de pré-carregamento sob demanda (hover prefetch) ao passar o mouse sobre botões de trailer e livros.
- **Arquivos-chave**: `src/components/common/SkeletonCard.tsx`, `src/hooks/use-prefetch.ts`.
- **Critério de Aceite**: Ao passar o cursor sobre um card de filme ou livro por mais de 100ms, metadados pesados e trailers do YouTube são pré-conectados em segundo plano (`dns-prefetch` e `modulepreload`), abrindo o modal com latência zero perceptível.
- **Impacto na Interação**: Elimina qualquer fricção ou sensação de espera, proporcionando velocidade instantânea ao usuário.

### [ ] Etapa 33: Gaveta Flutuante de Acessibilidade Visual e Cognitiva (Quick A11y Drawer)
- **Objetivo**: Desenvolver um painel flutuante de acessibilidade acessível via botão discreto no rodapé/lateral contendo controles imediatos: ajuste de tamanho da fonte (A- / A / A+), alternador para tipografia legível / OpenDyslexic, alto contraste e interruptor de pausa de animações.
- **Arquivos-chave**: `src/components/accessibility/A11yDrawer.tsx`, `src/hooks/use-a11y-preferences.ts`.
- **Critério de Aceite**: Alterações refletem instantaneamente no DOM via classes raiz (`html.high-contrast`, `html.font-large`, `html.dyslexic-friendly`); estado persistido no navegador; suporte total a leitores de tela.
- **Impacto na Interação**: Garante que leitores de todas as idades, com diferentes graus de visão ou neurodivergências, aproveitem a biografia com máximo conforto e autonomia.

### [ ] Etapa 34: Interação Social no Mural dos Fãs (Reações com Emojis & Contador de Carinho)
- **Objetivo**: Expandir o Mural de Cortiça permitindo que os visitantes reajam a qualquer post-it já fixado através de uma barra de reações em miniatura (❤️ "Amei", 👏 "Arrasou", 📖 "Li Tudo", ✨ "Inspirador"), com contador dinâmico e animação de mini-corações subindo pela tela.
- **Arquivos-chave**: `src/components/fan-wall/PostItNote.tsx`, `src/components/fan-wall/NoteReactions.tsx`, `src/hooks/use-local-notes.ts`.
- **Critério de Aceite**: Clicar na reação incrementa a contagem imediatamente no `localStorage` do usuário e exibe micro-explosão de corações com física orgânica; barra de busca e filtro rápido de post-its por cor e cidade de origem.
- **Impacto na Interação**: Converte a experiência passiva de leitura de recados em uma comunidade viva e afetiva de troca entre leitores da autora.

---

## 📌 Guia de Execução para Desenvolvedores e Agentes IA

1. **Execução Sequencial**: Cada etapa depende da infraestrutura da etapa anterior. Não pule etapas de fundação.
2. **Commit por Etapa**: Ao concluir cada etapa, marque a caixa `[x]` neste arquivo (`etapas.md`) e execute a checagem rápida de compilação.
3. **Escopo Protegido**: Caso uma etapa demande novos componentes, mantenha-os dentro de sua respectiva pasta modular em `src/components/`.
