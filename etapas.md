# 🗺️ Roteiro de Desenvolvimento: Universo Thalita Rebouças
## Guia de Execução em 24 Etapas Modulares (Otimizado para Desempenho e Contexto da IA)

> **Estratégia de Engenharia**: Este documento divide a criação do site biográfico hiper-interativo de **Thalita Rebouças** em **24 etapas incrementais e atômicas**. Cada etapa possui escopo estrito, arquivos delimitados e critérios de verificação objetivos, evitando perda de contexto do modelo de IA e garantindo fluidez contínua (60-120 FPS).

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

### [ ] Etapa 06: Barra de Navegação Flutuante & Pílula Sonora ("Sound Pill")
- **Objetivo**: Construir o header fixo/flutuante com logotipo estilizado de Thalita, links de navegação suave entre atos biográficos e o botão de áudio interativo com equalizador animado em CSS.
- **Arquivos-chave**: `src/components/common/Header.tsx`, `src/components/audio/SoundPill.tsx`.
- **Critério de Aceite**: Barra translúcida com glassmorphism, indicador animado de áudio que oscila quando ativo e se contrai quando mudo, clique com feedback visual.
- **Otimização para o Modelo**: Manter o componente autocontido com classes utilitárias diretas.

### [ ] Etapa 07: Shell Responsivo, Texturas de Fundo e Layout Base
- **Objetivo**: Criar a casca principal da aplicação com container responsivo, padrão sutil de caderno pautado/quadriculado, detalhes de adesivos e microgrid de alinhamento.
- **Arquivos-chave**: `src/components/layout/AppShell.tsx`, `src/App.tsx` (ou `src/app/page.tsx`).
- **Critério de Aceite**: Layout responsivo perfeito em resoluções de 320px até 4K; rolagem suave sem quebra de overflow horizontal indesejado.
- **Otimização para o Modelo**: Estabelecer a marcação estrutural de todas as 7 seções com IDs claros (`#hero`, `#timeline`, `#bookshelf`, `#cinema`, `#advices`, `#quiz`, `#fan-wall`).

---

## 🎨 FASE 3: O Ateliê da Autora & Linha do Tempo em Figurinhas

### [ ] Etapa 08: Hero Screen — O Ateliê Carioca da Thalita
- **Objetivo**: Implementar a seção Hero com estética de mesa de trabalho de escritora: cores solares do Rio, iluminação suave, óculos coloridos interativos e apresentação carismática.
- **Arquivos-chave**: `src/components/hero/HeroSection.tsx`, `src/components/hero/GlassesColorPicker.tsx`.
- **Critério de Aceite**: Ao passar o cursor ou tocar nos óculos da Thalita, eles alternam entre 4 cores clássicas (Rosa Choque, Amarelo Neon, Roxo, Turquesa) com microanimação de mola.
- **Otimização para o Modelo**: Dividir o Hero em subcomponentes para evitar arquivos gigantescos.

### [ ] Etapa 09: Máquina de Escrever Interativa com Efeito de Digitação
- **Objetivo**: Construir a máquina de escrever retrô onde o usuário pode clicar nas teclas (ou pressionar o teclado físico) emitindo som de máquina e digitando a frase-manifesto da autora na folha de papel.
- **Arquivos-chave**: `src/components/hero/Typewriter.tsx`.
- **Critério de Aceite**: Animação de cada letra surgindo na folha em fonte mono/typewriter, som tátil sincronizado e botão de "Concluir Frase" automática.
- **Otimização para o Modelo**: Controlar o loop de texto via `useEffect` limpo com cleanup para evitar memory leaks.

### [ ] Etapa 10: Linha do Tempo em Álbum de Figurinhas de Memórias
- **Objetivo**: Criar a linha do tempo biográfica em formato de álbum com polaroids inclinadas, carimbos da Bienal e cartões de memórias (1974 a 2024+).
- **Arquivos-chave**: `src/components/timeline/TimelineSection.tsx`, `src/components/timeline/PolaroidCard.tsx`.
- **Critério de Aceite**: Efeito de *tilt 3D* suave nas polaroids ao mover o mouse; scroll horizontal fluido em desktop e carrossel magnético no celular; aviãozinho de papel interativo animado.
- **Otimização para o Modelo**: Usar transformações CSS (`transform-style: preserve-3d`) leves sem pesar a GPU.

---

## 📚 FASE 4: Obras Literárias & Cine-Thalita

### [ ] Etapa 11: Estante Pop Tridimensional — Catálogo e Filtros
- **Objetivo**: Construir a estante de livros moderna com prateleiras estilizadas e sistema de filtros em pílulas ("Todos", "Fala Sério!", "Popstar", "Confissões", "Infantis").
- **Arquivos-chave**: `src/components/bookshelf/BookshelfSection.tsx`, `src/components/bookshelf/BookSpine.tsx`, `src/components/bookshelf/CategoryFilter.tsx`.
- **Critério de Aceite**: Filtragem instantânea sem reload, animação suave de reorganização dos livros na estante via Framer Motion / CSS Transitions.
- **Otimização para o Modelo**: Estruturar a renderização dos livros usando `key` estável baseada no slug do livro.

### [ ] Etapa 12: Leitor & Flipbook de Livros (Modal de Experiência Imersiva)
- **Objetivo**: Desenvolver o modal de abertura do livro selecionado em formato de livro aberto: página esquerda com capa e estatísticas editoriais; página direita com sinopse, citação e bastidores contados pela autora.
- **Arquivos-chave**: `src/components/bookshelf/BookFlipbookModal.tsx`.
- **Critério de Aceite**: Animação realista de abertura e fechamento de capa; tecla `ESC` fecha o modal; botão de fechar com feedback de clique e trava de scroll no fundo (`overflow: hidden`).
- **Otimização para o Modelo**: Usar portal React (`createPortal`) ou modal nativo com controle de foco e acessibilidade.

### [ ] Etapa 13: Claquete Interativa de Cinema
- **Objetivo**: Criar o componente de claquete de cinema onde o usuário puxa e solta a haste móvel (drag ou clique), disparando a animação de batida com som de *CLACK!*.
- **Arquivos-chave**: `src/components/cinema/Clapperboard.tsx`.
- **Critério de Aceite**: A batida da claquete acende um feixe de luz de projetor de cinema que destaca o filme selecionado na seção.
- **Otimização para o Modelo**: Isolar a física de rotação da claquete usando estados simples de mola no Framer Motion (`rotate: [0, -25, 0]`).

### [ ] Etapa 14: Cine-Thalita — Carrossel de Filmes e Bastidores das Telas
- **Objetivo**: Apresentar os 5 filmes adaptados das obras de Thalita (Netflix, Prime Video, Cinema), com elenco, sinopse, recordes de bilheteria e modal/aba com curiosidades e trailers.
- **Arquivos-chave**: `src/components/cinema/CinemaSection.tsx`, `src/components/cinema/MovieCard.tsx`, `src/components/cinema/TrailerModal.tsx`.
- **Critério de Aceite**: Navegação fluida entre os filmes, badges de streaming (Netflix / Prime Video / Cinema), reprodução de trailer ou teaser oficial em lightbox acessível.
- **Otimização para o Modelo**: Evitar iframes pesados pré-carregados; usar carregamento sob demanda do vídeo apenas ao clicar em "Assistir Trailer".

---

## 🎰 FASE 5: Gamificação Pop & Máquina de Conselhos

### [ ] Etapa 15: Máquina de Conselhos da Thalita (Caça-Níquel Pop)
- **Objetivo**: Construir a máquina estilo caça-níquel/roleta vintage de chicletes com alavanca acionável para sortear pílulas de humor e conselhos afetivos dos livros da autora.
- **Arquivos-chave**: `src/components/advice-machine/AdviceMachineSection.tsx`, `src/components/advice-machine/SlotReels.tsx`.
- **Critério de Aceite**: Ao acionar a alavanca, cilindros giram com efeito de desfoque de movimento (*blur*) e som de roleta; cápsula se abre exibindo o conselho sorteado e a assinatura de Thalita.
- **Otimização para o Modelo**: Gerar a animação de rotação com keyframes de translação rápida finalizando com desaceleração cúbica suave (`cubic-bezier`).

### [ ] Etapa 16: Gerador de Cards de Conselho para Redes Sociais
- **Objetivo**: Implementar a funcionalidade de exportação do conselho sorteado em formato de card estilizado (9:16 para Instagram Stories e 1:1 para feed/WhatsApp) com botão de cópia e download.
- **Arquivos-chave**: `src/components/advice-machine/ShareableCard.tsx`, `src/utils/card-generator.ts`.
- **Critério de Aceite**: Card com arte visual impecável, borda scrapbook, autógrafo digital e botão "Copiar Frase" com toast de confirmação.
- **Otimização para o Modelo**: Usar canvas HTML5 nativo ou estilização SVG exportável, evitando bibliotecas externas excessivamente pesadas.

### [ ] Etapa 17: Quiz Interativo "Qual Personagem de Thalita Rebouças É Você?"
- **Objetivo**: Desenvolver o mini-jogo de 3 perguntas dinâmicas estilo bilhete escolar ("Malu", "Tetê", "Gabi", "Davi"), com transição de cartões e cálculo automático de afinidade.
- **Arquivos-chave**: `src/components/quiz/QuizSection.tsx`, `src/components/quiz/QuizQuestionCard.tsx`, `src/components/quiz/QuizResultCard.tsx`.
- **Critério de Aceite**: Transições animadas entre perguntas; tela final com resultado personalizado, descrição divertida da personagem e explosão festiva de confetes via `canvas-confetti`.
- **Otimização para o Modelo**: Lógica determinística e pura em `src/data/quiz.ts` com cálculo simples de pontuação por pesos.

---

## 💌 FASE 6: Mural dos Fãs & Comunidade de Leitores

### [ ] Etapa 18: Mural dos Fãs da Bienal (Parede de Cortiça Interativa)
- **Objetivo**: Montar o mural de cortiça com post-its coloridos realistas, alfinetes fixadores, recados carinhosos de leitores e fotos históricas das sessões de 12 horas de autógrafos.
- **Arquivos-chave**: `src/components/fan-wall/FanWallSection.tsx`, `src/components/fan-wall/PostItNote.tsx`.
- **Critério de Aceite**: Post-its com rotações orgânicas aleatórias (-3° a 4°), efeito de balanço ao passar o mouse (*pendulum hover*) e sombras que simulam papel descolado da parede.
- **Otimização para o Modelo**: Renderização otimizada com CSS puro para as transformações de rotação e sombra.

### [ ] Etapa 19: Formulário Dinâmico de Novo Recado com Persistência
- **Objetivo**: Permitir que o visitante digite seu nome, cidade e mensagem, escolha a cor do post-it (Rosa, Amarelo, Azul, Lilás) e pregue seu recado no mural com som de fixação.
- **Arquivos-chave**: `src/components/fan-wall/AddNoteModal.tsx`, `src/hooks/use-local-notes.ts`.
- **Critério de Aceite**: O novo post-it aparece imediatamente na tela com animação de impacto; notas salvas no `localStorage` para permanecerem ao recarregar a página.
- **Otimização para o Modelo**: Sanitização simples de texto para prevenir injeção de HTML e validação de tamanho de caracteres (máx. 140 chars).

---

## ⚡ FASE 7: Acessibilidade, Performance 60 FPS & Polimento

### [ ] Etapa 20: Modo de Movimento Reduzido & Acessibilidade Inclusiva (a11y)
- **Objetivo**: Adaptar todas as animações para o padrão `prefers-reduced-motion: reduce`, adicionar atributos ARIA (`aria-label`, `role="dialog"`, `aria-live`) e assegurar navegação completa por teclado.
- **Arquivos-chave**: `src/hooks/use-reduced-motion.ts`, `src/index.css`.
- **Critério de Aceite**: Com a redução de movimento ativada no sistema operacional, a página substitui transições rápidas e giros 3D por fades suaves e transições discretas sem perder usabilidade.
- **Otimização para o Modelo**: Usar variáveis CSS com fallback condicional para velocidade de animação.

### [ ] Etapa 21: Otimização de Performance 60-120 FPS e Auditoria Mobile
- **Objetivo**: Garantir que as animações operem estritamente sobre propriedades GPU-friendly (`transform`, `opacity`), aplicar `will-change` moderadamente, otimizar tamanhos de imagens e auditar taxas de quadros em dispositivos móveis.
- **Arquivos-chave**: Toda a árvore de componentes em `src/components/`.
- **Critério de Aceite**: Zero quedas bruscas de frames (jank); score elevado no Lighthouse; carregamento responsivo sob 3G/4G.
- **Otimização para o Modelo**: Executar revisão sistemática seguindo o checklist da skill `performance-audit-cross-device`.

### [ ] Etapa 22: Adesivos Decorativos & Microinterações Magnéticas
- **Objetivo**: Implementar adesivos holográficos arrastáveis pelo usuário (*draggable stickers*) espalhados pela tela e efeito magnético nos botões primários de ação (o botão é atraído suavemente em direção ao cursor).
- **Arquivos-chave**: `src/components/common/MagneticButton.tsx`, `src/components/common/FloatingSticker.tsx`.
- **Critério de Aceite**: Adesivos podem ser arrastados com física natural e soltos em qualquer ponto; botões respondem com suavidade magnética no desktop.
- **Otimização para o Modelo**: Desativar o efeito magnético automaticamente em telas sensíveis ao toque (touch devices) via media query.

---

## 🏆 FASE 8: SEO Biográfico Schema.org & Validação Final

### [ ] Etapa 23: SEO Biográfico Estruturado (Schema.org Person / Books) & Metadados
- **Objetivo**: Inserir metatags completas de Open Graph, Twitter Cards e dados estruturados em JSON-LD (`Schema.org/Person`, `CreativeWorkSeries`, `Movie`) com links para perfis oficiais e biografia.
- **Arquivos-chave**: `index.html` (ou `src/app/layout.tsx`), `src/components/seo/StructuredData.tsx`.
- **Critério de Aceite**: Validador de Rich Results do Google reconhece a entidade "Thalita Rebouças" com suas ocupações, obras e mídias sociais.
- **Otimização para o Modelo**: Criar script JSON-LD compacto e sem duplicação de nós.

### [ ] Etapa 24: Validação Integrada End-to-End, Build de Produção e Entrega
- **Objetivo**: Executar build de produção (`npm run build`), verificar zero avisos de lint ou TypeScript, testar todos os 7 módulos em navegadores modernos e gerar relatório de entrega.
- **Arquivos-chave**: `dist/` (ou `.next/`), `README.md`.
- **Critério de Aceite**: Build limpo sem erros, todos os links externos funcionando, áudio responsivo, gamificação 100% interativa e documentação atualizada.
- **Otimização para o Modelo**: Executar comando de checagem de tipos (`tsc --noEmit`) antes do empacotamento final.

---

## 📌 Guia de Execução para Desenvolvedores e Agentes IA

1. **Execução Sequencial**: Cada etapa depende da infraestrutura da etapa anterior. Não pule etapas de fundação.
2. **Commit por Etapa**: Ao concluir cada etapa, marque a caixa `[x]` neste arquivo (`etapas.md`) e execute a checagem rápida de compilação.
3. **Escopo Protegido**: Caso uma etapa demande novos componentes, mantenha-os dentro de sua respectiva pasta modular em `src/components/`.
