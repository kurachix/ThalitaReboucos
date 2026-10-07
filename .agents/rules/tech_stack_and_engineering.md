# Regra: Stack Tecnológica, Linguagens e Engenharia (.agents/rules/tech_stack_and_engineering.md)

Esta diretriz define as tecnologias, ferramentas, padrões de arquitetura de código e métodos de engenharia para o desenvolvimento do site de Thalita Rebouças.

---

## 1. Stack Tecnológica Recomendada

Para unir **máximo desempenho interativo**, **SEO impecável** e **facilidade de manutenção**, adota-se a seguinte composição:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STACK DE DESENVOLVIMENTO                        │
├─────────────────────┬──────────────────────────────────────────────────┤
│ Camada              │ Tecnologia Selecionada & Versão                  │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Core Framework      │ Next.js 14+ (App Router) ou Vite 5+ (React 18/19)│
│ Linguagem           │ TypeScript (Strict Mode ativado)                 │
│ Estilização         │ Tailwind CSS + Modern CSS (Custom Properties)    │
│ Orquestração Scroll │ GSAP 3.12+ com plugin ScrollTrigger              │
│ Componentes & Gestos│ Framer Motion 11+                                │
│ Efeitos Tridimens.  │ React Three Fiber / Three.js (com fallback 2D)   │
│ Áudio Interativo    │ Howler.js (2.2+) ou Web Audio API Nativa         │
│ Ícones              │ Lucide-React                                     │
│ Gerenciador Estado  │ Zustand (Leve, sem boilerplate, < 1kB)           │
│ Confetes / Partículas│ Canvas-Confetti                                 │
└─────────────────────┴──────────────────────────────────────────────────┘
```

---

## 2. Tipografia e Design Tokens

A identidade da autora exige uma combinação entre tipografia editorial limpa e escrita manuscrita afetiva:

1. **Títulos Principais (Headings)**:
   - Família: `'Outfit', sans-serif` ou `'Poppins', sans-serif` (Google Fonts).
   - Características: Geométrica, alegre, moderna e com excelente legibilidade.
2. **Corpo de Texto (Body)**:
   - Família: `'Plus Jakarta Sans', sans-serif` ou `'Inter', sans-serif`.
   - Características: Altamente legível em telas pequenas e longos parágrafos biográficos.
3. **Acentos Manuscritos (Scrapbook & Dedicatórias)**:
   - Família: `'Caveat', cursive` ou `'Gaegu', cursive`.
   - Usado em: Post-its, recados nos cantos das fotos polaroids, balões de pensamento e autógrafos da Thalita.

---

## 3. Estrutura Modular de Pastas (Arquitetura do Projeto)

O projeto deve ser estruturado de forma desacoplada:

```
src/
├── app/                      # Rotas e páginas (Next.js App Router)
│   ├── layout.tsx            # Shell da aplicação, fonts, SEO e SoundProvider
│   ├── page.tsx              # Ponto de entrada da biografia interativa
│   └── opengraph-image.png   # Card social dinâmico
├── components/
│   ├── audio/                # SoundToggle, AudioPlayer, SFXController
│   ├── common/               # Botões magnéticos, Modais, Badges, Tooltips
│   ├── hero/                 # Mesa de trabalho interativa, máquina de escrever
│   ├── timeline/             # Álbum de figurinhas e linha do tempo com scroll
│   ├── bookshelf/            # Estante 3D, flipbook de livros e filtros
│   ├── cinema/               # Claquete animada, carrossel de filmes e bastidores
│   ├── advice-machine/       # Caça-níquel de conselhos da Thalita
│   ├── quiz/                 # "Qual personagem é você?" interativo
│   └── fan-wall/             # Mural de post-its e galeria de fotos da Bienal
├── hooks/
│   ├── use-audio.ts          # Hook para tocar SFX e controlar trilha sonora
│   ├── use-device.ts         # Detecção de touch, orientação e gpu low-end
│   ├── use-mouse-position.ts # Posição reativa do cursor com damping
│   └── use-reduced-motion.ts # Respeito às preferências de acessibilidade
├── store/
│   └── use-app-store.ts      # Estado global (som, livro ativo, quiz state)
├── data/
│   ├── biography.ts          # Marcos históricos e fotos
│   ├── books.ts              # Catálogo completo de livros com sinopses e tags
│   ├── movies.ts             # Filmes, elencos e trailers
│   ├── advices.ts            # Frases e conselhos dos livros
│   └── quiz-questions.ts     # Perguntas e lógica de cálculo do quiz
└── types/
    └── index.ts              # Interfaces e tipos TypeScript estritos
```

---

## 4. Gerenciamento de Estado com Zustand

O estado do site é mantido de forma reativa e leve:

```typescript
// src/store/use-app-store.ts
import { create } from 'zustand';

interface AppState {
  isAudioMuted: boolean;
  activeBookId: string | null;
  hasInteracted: boolean;
  collectedStickers: string[];
  toggleAudio: () => void;
  setActiveBook: (id: string | null) => void;
  collectSticker: (stickerId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAudioMuted: true, // Mudo por padrão
  activeBookId: null,
  hasInteracted: false,
  collectedStickers: [],
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setActiveBook: (id) => set({ activeBookId: id }),
  collectSticker: (id) =>
    set((state) => ({
      collectedStickers: state.collectedStickers.includes(id)
        ? state.collectedStickers
        : [...state.collectedStickers, id],
    })),
}));
```

---

## 5. SEO Biográfico e Dados Estruturados (Schema.org)

Para garantir que o site ranqueie no topo das buscas pelo nome da autora:
- Implementação de dados estruturados JSON-LD do tipo `Person`:
  - `name`: "Thalita Rebouças"
  - `jobTitle`: "Escritora, Roteirista, Jornalista e Atriz"
  - `birthPlace`: "Rio de Janeiro, Brasil"
  - `knowsAbout`: ["Literatura Juvenil", "Cinema Brasileiro", "Televisão"]
  - `sameAs`: Perfis oficiais do Instagram, Twitter, TikTok, Wikipedia.
- Metatags dinâmicas para compartilhamento no WhatsApp, X e Instagram.
