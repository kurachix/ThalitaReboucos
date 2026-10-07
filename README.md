# Universo Thalita Rebouças — Projeto do Site Biográfico Hiper-Interativo

Bem-vindo ao projeto de idealização do **Site Biográfico 100% Interativo de Thalita Rebouças**, a escritora ícone da juventude e cultura pop brasileira.

---

## 🌟 O Conceito: "O Ateliê Pop & Diário Mágico da Thalita"

Diferente de biografias estáticas tradicionais, este projeto foi concebido como uma **experiência digital viva, lúdica e sensorial**, que traduz o carisma contagiante, a estética *scrapbook* carioca e o afeto de Thalita Rebouças por seus mais de 2,3 milhões de leitores.

### Principais Módulos Interativos:
1. **Hero Screen (Ateliê da Autora)**: Máquina de escrever com digitação animada, óculos de cores mutáveis e toca-fitas pop lo-fi.
2. **Linha do Tempo em Álbum de Figurinhas**: Memórias, polaroids com efeito 3D tilt, cartas de recusa transformadas em aviões e carimbos de Bienal.
3. **Estante Pop Tridimensional**: Mais de 25 livros com animação física realista de *flipbook*, resumos e curiosidades exclusivas de bastidores.
4. **Cine-Thalita (Do Papel para as Telas)**: Claquete interativa que liga o projetor de cinema para exibir as adaptações (Netflix, Prime Video, Salas de Cinema).
5. **Máquina de Conselhos da Thalita**: Caça-níquel colorido que sorteia frases de humor e afeto com botão de exportação para Instagram Stories.
6. **Quiz "Qual Personagem É Você?"**: Mini-jogo interativo com chuva de confetes (`canvas-confetti`).
7. **Mural dos Fãs & Bienal Nostalgia**: Parede de cortiça com post-its interativos com alfinetes físicos.

---

## 📂 Documentação e Regras no `.agents`

Toda a arquitetura técnica, métodos de engenharia, diretrizes de performance e acervo histórico estão documentados no diretório [`.agents/`](file:///c:/Repositorio/ThalitaReboucos/.agents):

- **[AGENTS.md](file:///c:/Repositorio/ThalitaReboucos/.agents/AGENTS.md)**: Visão geral e orquestrador mestre das regras do agente.
- **Rules (Regras Modulares)**:
  - [`thalita_ux_and_storytelling.md`](file:///c:/Repositorio/ThalitaReboucos/.agents/rules/thalita_ux_and_storytelling.md): Persona, tom de voz carioca e narrativa dos 7 atos.
  - [`interaction_and_animation_architecture.md`](file:///c:/Repositorio/ThalitaReboucos/.agents/rules/interaction_and_animation_architecture.md): GSAP, Framer Motion, Sound Design (Howler.js) e microinterações.
  - [`tech_stack_and_engineering.md`](file:///c:/Repositorio/ThalitaReboucos/.agents/rules/tech_stack_and_engineering.md): Next.js/React, TypeScript, Zustand, Tailwind e SEO Schema.org.
  - [`cross_device_and_performance.md`](file:///c:/Repositorio/ThalitaReboucos/.agents/rules/cross_device_and_performance.md): Garantia de 60 FPS, touch-first mobile, fallbacks e acessibilidade (`prefers-reduced-motion`).
- **Skills (Workflows de Desenvolvimento)**:
  - [`thalita-component-crafting`](file:///c:/Repositorio/ThalitaReboucos/.agents/skills/thalita-component-crafting/SKILL.md): Guia prático de implementação de componentes hiper-interativos.
  - [`performance-audit-cross-device`](file:///c:/Repositorio/ThalitaReboucos/.agents/skills/performance-audit-cross-device/SKILL.md): Roteiro de auditoria de performance, Core Web Vitals e testes mobile.
- **Specs (Especificações Técnicas e de Conteúdo)**:
  - [`wireframes_and_interaction_flows.md`](file:///c:/Repositorio/ThalitaReboucos/.agents/specs/wireframes_and_interaction_flows.md): Wireframes e fluxos detalhados de interação tela por tela.
  - [`content_inventory_thalita_reboucos.md`](file:///c:/Repositorio/ThalitaReboucos/.agents/specs/content_inventory_thalita_reboucos.md): Acervo biográfico real, catálogo de 25+ livros, filmes e citações.

---

## 🛠️ Tecnologias Principais

- **Linguagem**: TypeScript (Strict Mode)
- **Framework**: Next.js 14+ / React 18+
- **Estilos**: Tailwind CSS + Modern CSS (Custom Properties)
- **Animações**: GSAP (ScrollTrigger) + Framer Motion
- **Áudio**: Howler.js (com política rigorosa de *opt-in* e mudo por padrão)
- **Interação 3D / Partículas**: React Three Fiber / CSS 3D Transforms + Canvas-Confetti
