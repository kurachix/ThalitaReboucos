/**
 * Utilitário de Resposta Háptica (Haptic Feedback) via Vibration API
 * Proporciona sensações táteis físicas em dispositivos móveis compatíveis
 * (smartphones e tablets Android e navegadores com suporte a navigator.vibrate).
 */

export type HapticPattern = 
  | 'light'    // Digitação de teclas na máquina, toques suaves, micro-hover
  | 'medium'   // Cliques em botões de ação primária, fixação de post-it no mural
  | 'heavy'    // Batida de impacto da claquete de cinema, alavanca do caça-níqueis
  | 'success'  // Conclusão comemorativa do quiz, revelação de conselho da autora
  | 'double'   // Feedback duplo de confirmação (ex: copiar frase para clipboard)
  | 'error';   // Validação de formulário com campos pendentes

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 15,
  medium: 25,
  heavy: 45,
  success: [20, 45, 30],
  double: [15, 30, 20],
  error: [30, 40, 30, 40, 50],
};

/**
 * Dispara uma vibração tátil no dispositivo do usuário se suportado.
 * Retorna true se a vibração foi acionada com sucesso.
 */
export function triggerHaptic(pattern: HapticPattern | number | number[] = 'medium'): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Verifica se o navegador atual implementa a Vibration API
  if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') {
    return false;
  }

  try {
    const vibrationData = typeof pattern === 'string' 
      ? (HAPTIC_PATTERNS[pattern] ?? 20) 
      : pattern;

    return navigator.vibrate(vibrationData);
  } catch {
    // Falha silenciosa caso o navegador imponha restrições de permissões
    return false;
  }
}
