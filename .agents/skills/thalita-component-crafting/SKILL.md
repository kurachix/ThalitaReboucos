---
name: thalita-component-crafting
description: Guia de desenvolvimento e padrões para criação de componentes hiper-interativos no site biográfico de Thalita Rebouças.
---

# Skill: Desenvolvimento de Componentes Hiper-Interativos

Esta skill orienta os desenvolvedores e agentes na criação de novos componentes visuais para o site da Thalita Rebouças, garantindo aderência à identidade lúdica, responsividade e alto padrão de animação.

---

## 1. Anatomia Padrão de um Componente Interativo

Todo componente interativo deve seguir o contrato:

```typescript
// Exemplo: src/components/bookshelf/InteractiveBookCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Book } from '@/types';

interface InteractiveBookCardProps {
  book: Book;
  onOpen: (book: Book) => void;
}

export const InteractiveBookCard: React.FC<InteractiveBookCardProps> = ({ book, onOpen }) => {
  const { playSfx } = useAudio();
  const prefersReduced = useReducedMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 15, y: x * 15 });
  };

  const handlePointerLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleClick = () => {
    playSfx('page_turn');
    onOpen(book);
  };

  return (
    <motion.div
      className="book-card-container relative cursor-pointer select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      whileHover={{ scale: prefersReduced ? 1 : 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.15s ease-out'
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Abrir detalhes do livro ${book.title}`}
    >
      {/* Capa com brilho dinâmico */}
      <img
        src={book.coverUrl}
        alt={`Capa do livro ${book.title}`}
        loading="lazy"
        className="rounded-xl shadow-lg border-2 border-white/40"
      />
      <div className="book-spine-effect" />
    </motion.div>
  );
};
```

---

## 2. Checklist Obrigatório para Novos Componentes

Ao finalizar qualquer componente:
- [ ] O componente funciona tanto com **mouse (hover)** quanto com **toque (tap)**?
- [ ] Possui suporte sonoro (`useAudio`) com fallback silencioso caso o som esteja mutado?
- [ ] Respeita `useReducedMotion` desativando giros bruscos para usuários sensíveis?
- [ ] Tem atributos de acessibilidade (`aria-label`, `role`, navegação por `Enter`/`Space`)?
- [ ] A performance está garantida com `transform` em vez de alterar dimensões no layout?
