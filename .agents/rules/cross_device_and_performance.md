# Regra: Performance Cross-Device, Mobile e Acessibilidade (.agents/rules/cross_device_and_performance.md)

Esta diretriz detalha os métodos de engenharia essenciais para assegurar que a experiência hiper-interativa funcione com fluidez extrema (60-120 FPS) em smartphones econômicos, tablets, laptops e monitores 4K.

---

## 1. Otimização de Performance (Taxa de Quadros a 60 FPS)

Um site animado em quase todas as ações só é agradável se a renderização for instantânea e sem engasgos (*jank*).

### 1.1. Regras de Ouro de Renderização:
1. **Pintura e Reflow Zero**: Animações contínuas devem manipular **exclusivamente** `transform` (`translate3d`, `scale`, `rotate`) e `opacity`. Jamais anime propriedades como `width`, `height`, `top`, `margin`, `padding` ou `box-shadow` em loops de scroll ou mousemove.
2. **Uso Consciente de `will-change`**:
   - Aplique `will-change: transform, opacity;` apenas nos elementos ativamente animados durante o evento.
   - Remova a propriedade assim que a transição terminar para liberar memória de textura na GPU.
3. **Throttling e Eventos Passivos**:
   - Todos os ouvintes de evento de rolagem e toque devem utilizar a flag passiva:
     ```javascript
     window.addEventListener('scroll', onScroll, { passive: true });
     window.addEventListener('touchstart', onTouch, { passive: true });
     ```
   - Rastreamento de coordenadas do cursor deve ser sincronizado com `requestAnimationFrame` (RAF), evitando recálculos desnecessários por pixel.

---

## 2. Adaptação para Diferentes Dispositivos

```
┌────────────────────────────────────────────────────────────────────────┐
│                      MATRIZ DE DISPOSITIVOS E UX                       │
├─────────────────┬──────────────────────┬───────────────────────────────┤
│ Dispositivo     │ Resoluções Típicas   │ Comportamento Específico      │
├─────────────────┼──────────────────────┼───────────────────────────────┤
│ Mobile          │ 360px - 480px        │ Layout vertical com snap,     │
│ (Smartphones)   │ (Retina / OLED)      │ Gestos de Swipe & Tap,        │
│                 │                      │ Sem custom cursor, áudio pill │
├─────────────────┼──────────────────────┼───────────────────────────────┤
│ Tablets /       │ 768px - 1024px       │ Grid responsivo de 2 colunas, │
│ Dobráveis       │                      │ Orientação dinâmica,          │
│                 │                      │ Suporte híbrido (touch/mouse) │
├─────────────────┼──────────────────────┼───────────────────────────────┤
│ Desktops /      │ 1280px - 1920px+     │ Parallax multidirecional,     │
│ Laptops         │                      │ Custom cursor com magnetismo, │
│                 │                      │ Estante 3D completa           │
└─────────────────┴──────────────────────┴───────────────────────────────┘
```

### 2.1. Adaptações Críticas para Mobile:
- **Zonas de Toque (Touch Targets)**: Todos os botões, figurinhas, teclas e post-its devem ter área clicável mínima de **48x48px** para evitar toques acidentais.
- **Alternativa ao Hover**:
  - Em telas sensíveis ao toque, efeitos ativados por `:hover` não funcionam como no desktop.
  - Todo elemento com segredos ou curiosidades (ex: flip das polaroids e capas de livros) deve abrir no **primeiro toque (Tap)** e fechar no toque externo ou botão de fechar dedicado.
- **Safe Area Insets (iOS / Android)**:
  - Utilizar `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)` para evitar que botões flutuantes (como o botão de som ou menu) colidam com a barra de navegação do sistema ou com o Dynamic Island.
- **Prevenção de Rolagem Indesejada em Gestos**:
  - Em elementos com arrasto interativo (como o mural de post-its ou carrossel de fotos), utilize `touch-action: pan-y` ou `touch-action: none` especificamente na zona de manipulação.

---

## 3. Degradação Graciosa e Dispositivos Econômicos (Tiering)

Nem todo usuário possui um smartphone de última geração. O site deve reconhecer o hardware e ajustar o nível de fidelidade gráfica:

```typescript
// src/hooks/use-device-capability.ts
export function useDeviceCapability() {
  const isLowEnd = typeof navigator !== 'undefined' && (
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    // @ts-ignore
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    // @ts-ignore
    (navigator.connection && navigator.connection.saveData)
  );

  return {
    isLowEnd,
    enable3D: !isLowEnd,
    particleCount: isLowEnd ? 15 : 60,
    enableBlurFilters: !isLowEnd // backdrop-filter é custoso em GPUs lentas
  };
}
```

- **Fallback para a Estante 3D**: Se `isLowEnd === true`, em vez de renderizar geometrias no Three.js, o componente renderiza uma galeria CSS 3D ultraleve com `transform: perspective(1000px) rotateY(15deg)`. Visualmente o efeito é idêntico e o consumo de bateria cai em 80%.

---

## 4. Acessibilidade Inclusiva (WCAG 2.1 AA)

1. **Suporte a `prefers-reduced-motion`**:
   - Detectado via CSS e JavaScript:
     ```css
     @media (prefers-reduced-motion: reduce) {
       *, *::before, *::after {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
         scroll-behavior: auto !important;
       }
     }
     ```
   - O conteúdo biográfico completo continua 100% legível e acessível sem exigir que o usuário veja elementos girando ou se deslocando.
2. **Navegação Completa por Teclado**:
   - Foco visual nítido (`:focus-visible` com anel colorido de alto contraste).
   - Tecla `Escape` fecha imediatamente o leitor de livros, modais e o quiz.
   - Navegação por setas (`ArrowLeft`, `ArrowRight`) na linha do tempo e estante de livros.
3. **Leitores de Tela (Screen Readers)**:
   - Todas as ilustrações e fotos históricas recebem atributos `alt` descritivos (ex: *"Foto de Thalita Rebouças abraçando fãs na Bienal do Livro de 2018"*).
   - Elementos puramente decorativos recebem `aria-hidden="true"`.
