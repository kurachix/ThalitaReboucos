# Regra: Arquitetura de Interação, Animações e Sound Design (.agents/rules/interaction_and_animation_architecture.md)

Esta diretriz estabelece os padrões técnicos e visuais para criar um site **100% interativo**, garantindo que as animações sejam expressivas, orgânicas, suaves (60 FPS) e com áudio integrado de alta qualidade.

---

## 1. Motores de Animação e Especialização

Para atingir a sensação de site vivo sem sobrecarregar o navegador, distribuímos as tarefas entre três motores complementares:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HIERARQUIA DE ANIMAÇÃO                          │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ Motor               │ Responsabilidade         │ Casos de Uso          │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ GSAP + ScrollTrigger│ Orquestração de Scroll   │ Timeline horizontal,  │
│                     │ e Linha do Tempo         │ Parallax de camadas,  │
│                     │                          │ Pinned sections       │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Framer Motion       │ Componentes Reativos,    │ Modais, Drag & Drop,  │
│                     │ Gestos e Layout Transitions│ Flipbook de livros,  │
│                     │                          │ Quiz e Caça-níqueis   │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Canvas / Shaders 2D │ Partículas, Glitter      │ Chuva de confetes,    │
│ & Three.js (Lite)   │ e Estante 3D interativa  │ Folhas caindo,        │
│                     │                          │ Livros giratórios     │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 2. Padrões de Microinterações

Cada elemento interativo deve comunicar resposta tátil imediata ao usuário:

### 2.1. Cursor Reativo & Efeito Magnético (Desktop)
- O cursor padrão pode ser substituído por um ponteiro lúdico (ex: círculo pastel com anel magnético que se expande ao passar por botões).
- Ao passar por links e botões, os elementos possuem atração magnética sutil (`gsap.to(button, { x: deltaX * 0.3, y: deltaY * 0.3, duration: 0.2 })`).
- Em telas touch (mobile/tablet), o cursor personalizado é automaticamente desativado para evitar sobrecarga e lag no ponteiro nativo.

### 2.2. Efeito "3D Card Tilt" em Capas e Polaroids
- Cartas, fotos polaroids e capas de livros calculam a posição do ponteiro em relação ao centro do elemento:
  ```typescript
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 20); // Graus de rotação no eixo X
    setRotateY(x * 20);  // Graus de rotação no eixo Y
  };
  ```
- No mobile, esse efeito pode ser ativado opcionalmente via giroscópio (`DeviceOrientationEvent`) com suavização por interpolação linear (*lerp*).

### 2.3. Física de Molas (Spring Physics)
- Nenhuma transição linear mecânica deve ser utilizada.
- Parâmetros recomendados para o Framer Motion:
  ```json
  {
    "type": "spring",
    "stiffness": 380,
    "damping": 26,
    "mass": 0.8
  }
  ```

---

## 3. Arquitetura de Sound Design (Áudio Interativo)

O áudio enriquece a experiência nostálgica e pop da Thalita Rebouças, mas **nunca deve ser invasivo**.

### 3.1. Políticas de Áudio (Audio Guidelines):
1. **Mudo por Padrão (Strict Opt-in)**: A página sempre carrega sem reproduzir som automático, respeitando a política de autoplay de todos os browsers e a tranquilidade do usuário.
2. **Controle Visível (Sound Pill)**: Um botão flutuante com indicador de ondas sonoras animadas permite ao usuário ligar/desligar a trilha e os efeitos sonoros a qualquer instante.
3. **Persistência**: O estado de áudio (`audio_enabled: true | false`) é salvo em `localStorage`.
4. **Volume Balanceado**: Trilha de fundo a no máximo 15% (0.15) e efeitos sonoros a 25% (0.25).

### 3.2. Catálogo de Efeitos Sonoros (SFX):
- `pop.mp3`: Ao clicar em figurinhas ou botões de reação.
- `page_turn.mp3`: Ao abrir o livro na estante 3D.
- `typewriter_key.mp3`: Ao teclar na máquina de escrever do Hero.
- `clapperboard_snap.mp3`: Ao bater a claquete na seção de cinema.
- `pin_drop.mp3`: Ao fixar um recado no mural de post-its.
- `cheer_crowd.mp3`: Ao finalizar o quiz ou acionar a celebração de confetes da Bienal.

Implementação via **Howler.js** ou **Web Audio API** com pré-carregamento assíncrono para garantir latência zero no clique.

---

## 4. Partículas e Efeitos de Celebração

Para o espírito festivo da autora:
- Uso da biblioteca ultraleve `canvas-confetti` para explosões de estrelas e confetes rosas/dourados.
- Triggers:
  - Ao acertar o quiz.
  - Ao tirar um conselho na máquina mágica.
  - Ao clicar no botão de easter egg secreto "Glitter!".
