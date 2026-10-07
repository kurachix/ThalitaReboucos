---
name: performance-audit-cross-device
description: Procedimento sistemático para auditar taxa de quadros (60fps), compatibilidade mobile e consumo de recursos no site de Thalita Rebouças.
---

# Skill: Auditoria de Performance e Validação Cross-Device

Esta skill fornece uma rotina rigorosa de verificação para garantir que o site funcione com perfeição estética e operacional em múltiplos navegadores e perfis de hardware.

---

## 1. Métricas de Referência (Core Web Vitals)

O site deve atingir as seguintes marcas em ambiente de produção:

| Métrica | Limite Aceitável | Limite Crítico | Ação Corretiva |
| :--- | :--- | :--- | :--- |
| **FPS em Rolagem** | 60 fps estável | < 50 fps | Remover `filter: blur` durante scroll; usar CSS `will-change` moderado. |
| **LCP (Largest Contentful Paint)** | ≤ 1.8 segundos | > 2.5 segundos | Converter capas de livros para formato WebP/AVIF e aplicar lazy-loading. |
| **CLS (Cumulative Layout Shift)**| < 0.05 | > 0.1 | Definir `aspect-ratio` fixo em imagens e carrosséis antes do carregamento. |
| **INP (Interaction to Next Paint)**| < 150 ms | > 200 ms | Desacoplar animações pesadas com `requestAnimationFrame` e transições Framer. |

---

## 2. Roteiro de Teste no Chrome DevTools

1. **Emulação Mobile & CPU Throttling**:
   - Abrir DevTools (`F12`) -> Modo Dispositivo (`Ctrl + Shift + M`).
   - Selecionar: **Moto G4** ou perfil customizado com **4x CPU Slowdown** e rede **Fast 3G**.
   - Percorrer a linha do tempo e abrir 3 livros na estante.
   - Observar o painel **Performance**: a taxa de frames não deve cair para a zona vermelha.

2. **Auditoria de Memória**:
   - Verificar no painel **Memory** se os ouvintes de evento (`eventListeners`) dos efeitos de áudio e do cursor diminuem quando as seções são desmontadas.
   - Garantir que instâncias do Howler.js ou do Three.js realizem `dispose()` e `unload()` adequadamente.

3. **Verificação de Acessibilidade Sonora**:
   - Confirmar que o site abre 100% mudo.
   - Clicar no botão de som: verificar se o áudio toca sem latência perceptível.
   - Recarregar a página: verificar se a escolha do usuário permaneceu salva no `localStorage`.
