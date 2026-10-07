# Thalita Rebouças: Universo Interativo — Regras e Diretrizes do Projeto (.agents)

Bem-vindo ao repositório de idealização e engenharia do **Site Biográfico Hiper-Interativo de Thalita Rebouças**.
Este arquivo é a fonte primária de verdade (`AGENTS.md`) para qualquer agente de inteligência artificial ou desenvolvedor que for iterar, implementar ou auditar o projeto.

---

## 1. Visão Geral do Produto

O objetivo deste projeto é construir uma experiência web biográfica que rompe o formato enciclopédico tradicional e se transforma em uma **experiência digital imersiva, lúdica, viva e 100% interativa**. 

Thalita Rebouças é uma das autoras mais queridas da literatura infanto-juvenil e pop brasileira, com mais de 25 livros publicados, mais de 2,3 milhões de exemplares vendidos, adaptações campeãs de bilheteria e streaming (Netflix, Prime Video, Globoplay), além de forte presença televisiva (*The Voice Kids*) e teatral. O site reflete essa energia vibrante através de:
- **Scrapbook / Diário Pop Animado**: Estética inspiradora de cadernos customizados, adesivos holográficos, polaroids e cores solares cariocas.
- **Microinterações Contínuas**: Quase toda ação do usuário desencadeia resposta visual, sonora ou física (física de molas, confetes, tilt 3D, folhear de páginas).
- **Gamificação Afetiva**: Quizzes, caça-níqueis de conselhos de amizade/mãe, estante de livros tridimensional e claquete interativa de cinema.
- **Design Adaptativo de Alta Fidelidade**: Fluidez absoluta (60-120 FPS) tanto em smartphones de entrada quanto em telas UltraWide e laptops.

---

## 2. Mapa da Documentação no `.agents`

A inteligência e as regras deste projeto estão modularizadas dentro de `.agents/`:

```
.agents/
├── AGENTS.md                                        # (Este arquivo) Guia mestre e visão geral
├── rules/
│   ├── thalita_ux_and_storytelling.md               # Tom de voz, biografia afetiva e universo narrativo
│   ├── interaction_and_animation_architecture.md     # GSAP, Framer Motion, Canvas 3D e Sound Design
│   ├── tech_stack_and_engineering.md                # Arquitetura Next.js/React, TypeScript, CSS e APIs
│   └── cross_device_and_performance.md              # 60fps, Touch Gestures, Fallbacks e Acessibilidade
├── skills/
│   ├── thalita-component-crafting/
│   │   └── SKILL.md                                 # Workflow de criação de componentes hiper-interativos
│   └── performance-audit-cross-device/
│       └── SKILL.md                                 # Checklist e scripts de auditoria de performance e mobile
└── specs/
    ├── wireframes_and_interaction_flows.md          # Fluxo visual detalhado seção por seção
    └── content_inventory_thalita_reboucos.md        # Curadoria biográfica, bibliografia e cinematografia
```

---

## 3. Diretrizes de Comportamento para Agentes

Ao operar neste projeto, todo agente deve respeitar as seguintes diretivas:

1. **Prioridade Visual & Sensorial**: Nunca proponha ou escreva código com interfaces estáticas ou cinzentas. A interface deve respirar cor, dinamismo, tipografia expressiva e micro-animações refinadas.
2. **Respeito ao Desempenho e Bateria**: Hiper-interatividade não pode significar lentidão. Animações devem ser aceleradas por hardware (`transform`, `opacity`). Elementos 3D devem ter fallbacks 2D inteligentes para celulares econômicos.
3. **Acessibilidade Inclusiva (a11y)**: Usuários com `prefers-reduced-motion` devem receber versões elegantes e suaves sem parallax extremo. O áudio deve começar em estado mudo (*opt-in* explícito) com controles visuais evidentes.
4. **Fidelidade à Autora**: O tom deve ser acolhedor, bem-humorado, carioca, jovem e caloroso, espelhando os livros e a personalidade de Thalita Rebouças.
