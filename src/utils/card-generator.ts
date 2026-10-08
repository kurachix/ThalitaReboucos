/**
 * Gerador de Cards de Conselho para Redes Sociais (Canvas HTML5 Nativo)
 * Universo Thalita Rebouças — Zero dependências externas pesadas
 * Exporta em 9:16 (Instagram Stories) e 1:1 (Feed/WhatsApp) em alta definição (1080p).
 */

export type CardFormat = '9:16' | '1:1';
export type CardThemeId = 'rose-pop' | 'solar-rio' | 'sea-breeze' | 'lavender-dream';

export interface CardThemeConfig {
  id: CardThemeId;
  name: string;
  emoji: string;
  bgGradient: [string, string, string]; // Topo, Meio, Base
  paperBg: string;
  cardBorder: string;
  stitchColor: string;
  washiColor: string;
  washiText: string;
  badgeBg: string;
  badgeText: string;
  quoteColor: string;
  quoteAccent: string;
  bookBadgeBg: string;
  bookBadgeText: string;
  signatureColor: string;
  signatureSubColor: string;
  heartColor: string;
  confettiColors: string[];
}

export const CARD_THEMES: Record<CardThemeId, CardThemeConfig> = {
  'rose-pop': {
    id: 'rose-pop',
    name: 'Rosa Pop',
    emoji: '🌸',
    bgGradient: ['#FFE4E6', '#FFD1DC', '#FCE7F3'],
    paperBg: '#FFFDF8',
    cardBorder: '#F43F5E',
    stitchColor: '#FB7185',
    washiColor: 'rgba(255, 209, 59, 0.92)',
    washiText: '#78350F',
    badgeBg: '#FFE4E6',
    badgeText: '#E11D48',
    quoteColor: '#1E293B',
    quoteAccent: 'rgba(244, 63, 94, 0.22)',
    bookBadgeBg: '#F1F5F9',
    bookBadgeText: '#475569',
    signatureColor: '#FF2A85',
    signatureSubColor: '#64748B',
    heartColor: '#FF2A85',
    confettiColors: ['#FF2A85', '#FFD13B', '#00B4D8', '#A855F7', '#F43F5E'],
  },
  'solar-rio': {
    id: 'solar-rio',
    name: 'Sol Carioca',
    emoji: '☀️',
    bgGradient: ['#FEF3C7', '#FDE68A', '#FED7AA'],
    paperBg: '#FFFDF8',
    cardBorder: '#F59E0B',
    stitchColor: '#D97706',
    washiColor: 'rgba(255, 42, 133, 0.9)',
    washiText: '#FFFFFF',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    quoteColor: '#1E293B',
    quoteAccent: 'rgba(245, 158, 11, 0.22)',
    bookBadgeBg: '#FEF9C3',
    bookBadgeText: '#854D0E',
    signatureColor: '#D97706',
    signatureSubColor: '#78350F',
    heartColor: '#F43F5E',
    confettiColors: ['#F59E0B', '#FF2A85', '#10B981', '#3B82F6', '#FFD13B'],
  },
  'sea-breeze': {
    id: 'sea-breeze',
    name: 'Brisa do Mar',
    emoji: '🌊',
    bgGradient: ['#E0F2FE', '#BAE6FD', '#CCFBF1'],
    paperBg: '#FFFFFF',
    cardBorder: '#0284C7',
    stitchColor: '#38BDF8',
    washiColor: 'rgba(255, 209, 59, 0.92)',
    washiText: '#78350F',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    quoteColor: '#0F172A',
    quoteAccent: 'rgba(2, 132, 199, 0.2)',
    bookBadgeBg: '#F0FDF4',
    bookBadgeText: '#15803D',
    signatureColor: '#0284C7',
    signatureSubColor: '#475569',
    heartColor: '#FF2A85',
    confettiColors: ['#00B4D8', '#FFD13B', '#FF2A85', '#2EC4B6', '#60A5FA'],
  },
  'lavender-dream': {
    id: 'lavender-dream',
    name: 'Lavanda Sonho',
    emoji: '💜',
    bgGradient: ['#F3E8FF', '#E9D5FF', '#FCE7F3'],
    paperBg: '#FFFFFF',
    cardBorder: '#9333EA',
    stitchColor: '#C084FC',
    washiColor: 'rgba(52, 211, 153, 0.92)',
    washiText: '#064E3B',
    badgeBg: '#F3E8FF',
    badgeText: '#7E22CE',
    quoteColor: '#1E1B4B',
    quoteAccent: 'rgba(147, 51, 234, 0.2)',
    bookBadgeBg: '#F5F3FF',
    bookBadgeText: '#5B21B6',
    signatureColor: '#9333EA',
    signatureSubColor: '#6B7280',
    heartColor: '#EC4899',
    confettiColors: ['#A855F7', '#EC4899', '#38BDF8', '#FBBF24', '#34D399'],
  },
};

export interface CardRenderOptions {
  quote: string;
  categoryLabel: string;
  bookOrigin: string;
  format: CardFormat;
  themeId: CardThemeId;
}

/**
 * Utilitário para desenhar um retângulo com cantos arredondados
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Desenha fita adesiva (Washi Tape) estilo scrapbook com pontas rasgadas
 */
function drawWashiTape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  width: number,
  height: number,
  color: string,
  textColor: string,
  text: string,
  angleRad: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);

  const halfW = width / 2;
  const halfH = height / 2;
  const zigZagStep = 5;

  ctx.beginPath();
  // Topo reto
  ctx.moveTo(-halfW, -halfH);
  ctx.lineTo(halfW, -halfH);

  // Ponta direita picotada / rasgada
  for (let y = -halfH; y <= halfH; y += zigZagStep) {
    const offset = (Math.abs(Math.sin(y * 0.7)) * 5) - 2;
    ctx.lineTo(halfW + offset, y);
  }

  // Base reta
  ctx.lineTo(-halfW, halfH);

  // Ponta esquerda picotada / rasgada
  for (let y = halfH; y >= -halfH; y -= zigZagStep) {
    const offset = (Math.abs(Math.sin(y * 0.7)) * 5) - 2;
    ctx.lineTo(-halfW - offset, y);
  }

  ctx.closePath();

  // Sombra leve da fita
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = color;
  ctx.fill();

  // Textura sutil de listras diagonais na fita
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  for (let i = -halfW - 50; i < halfW + 50; i += 18) {
    ctx.beginPath();
    ctx.moveTo(i, -halfH - 10);
    ctx.lineTo(i + 30, halfH + 10);
    ctx.stroke();
  }
  ctx.restore();

  // Texto da fita
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = textColor;
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 1);

  ctx.restore();
}

/**
 * Desenha confetes e estrelinhas decorativas no fundo
 */
function drawScrapbookConfetti(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[]
) {
  ctx.save();

  // Semente determinística simples para manter padrão harmonioso
  const positions = [
    { x: 0.12, y: 0.06, r: 9, shape: 'circle', color: colors[0] },
    { x: 0.88, y: 0.08, r: 12, shape: 'star', color: colors[1] },
    { x: 0.06, y: 0.35, r: 8, shape: 'circle', color: colors[2] },
    { x: 0.94, y: 0.40, r: 10, shape: 'diamond', color: colors[3] },
    { x: 0.08, y: 0.72, r: 11, shape: 'star', color: colors[1] },
    { x: 0.92, y: 0.78, r: 8, shape: 'circle', color: colors[0] },
    { x: 0.15, y: 0.94, r: 9, shape: 'diamond', color: colors[2] },
    { x: 0.84, y: 0.93, r: 12, shape: 'circle', color: colors[4] || colors[0] },
    { x: 0.50, y: 0.04, r: 7, shape: 'star', color: colors[3] },
    { x: 0.30, y: 0.07, r: 6, shape: 'circle', color: colors[1] },
    { x: 0.70, y: 0.06, r: 8, shape: 'circle', color: colors[2] },
  ];

  positions.forEach((p) => {
    const px = p.x * width;
    const py = p.y * height;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.45;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(px, py - p.r);
      ctx.lineTo(px + p.r, py);
      ctx.lineTo(px, py + p.r);
      ctx.lineTo(px - p.r, py);
      ctx.closePath();
      ctx.fill();
    } else if (p.shape === 'star') {
      ctx.font = `${p.r * 2.2}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', px, py);
    }
  });

  ctx.restore();
}

/**
 * Desenha o coração vetorizado e floreio autoral de Thalita Rebouças
 */
function drawThalitaSignatureHeart(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Traço fluido manuscrito que desemboca em um coração
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(startX + 20, startY - 8, startX + 35, startY + 12, startX + 50, startY - 5);
  ctx.stroke();

  // Coração desenhado com curvas suaves
  const hx = startX + 65;
  const hy = startY - 14;
  const scale = 1.2;

  ctx.beginPath();
  ctx.moveTo(hx, hy + 8 * scale);
  ctx.bezierCurveTo(hx, hy, hx - 12 * scale, hy, hx - 12 * scale, hy + 10 * scale);
  ctx.bezierCurveTo(hx - 12 * scale, hy + 20 * scale, hx, hy + 26 * scale, hx, hy + 32 * scale);
  ctx.bezierCurveTo(hx, hy + 26 * scale, hx + 12 * scale, hy + 20 * scale, hx + 12 * scale, hy + 10 * scale);
  ctx.bezierCurveTo(hx + 12 * scale, hy, hx, hy, hx, hy + 8 * scale);
  ctx.closePath();
  ctx.globalAlpha = 0.9;
  ctx.fill();

  // Brilho estelar perto do coração
  ctx.globalAlpha = 0.8;
  ctx.font = '24px "Caveat", cursive';
  ctx.fillText('✨', hx + 18, hy + 4);

  ctx.restore();
}

/**
 * Quebra de linha inteligente para o texto do conselho
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Renderiza o Card de Conselho completo em um HTMLCanvasElement nativo
 */
export async function generateAdviceCardCanvas(
  options: CardRenderOptions
): Promise<HTMLCanvasElement> {
  const { quote, categoryLabel, bookOrigin, format, themeId } = options;
  const theme = CARD_THEMES[themeId] || CARD_THEMES['rose-pop'];

  // Assegura carregamento das fontes do Google Fonts antes do desenho
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continua caso o navegador não responda
    }
  }

  const canvas = document.createElement('canvas');
  const isStories = format === '9:16';

  // Dimensões HD cristalinas
  const width = 1080;
  const height = isStories ? 1920 : 1080;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível inicializar o contexto 2D do Canvas.');
  }

  // Ativa anti-aliasing de alta precisão
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // ========================================================
  // 1. FUNDO COM GRADIENTE TEMÁTICO
  // ========================================================
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, theme.bgGradient[0]);
  bgGrad.addColorStop(0.5, theme.bgGradient[1]);
  bgGrad.addColorStop(1, theme.bgGradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Confetes e estrelinhas no fundo
  drawScrapbookConfetti(ctx, width, height, theme.confettiColors);

  // ========================================================
  // 2. CABEÇALHO DO FUNDO
  // ========================================================
  ctx.save();
  ctx.fillStyle = theme.quoteColor;
  ctx.globalAlpha = 0.7;
  ctx.font = 'bold 24px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const headerY = isStories ? 115 : 45;
  ctx.fillText('✦ UNIVERSO THALITA REBOUÇAS ✦', width / 2, headerY);
  ctx.restore();

  // ========================================================
  // 3. CARTÃO DE PAPEL SCRAPBOOK
  // ========================================================
  const cardW = isStories ? 920 : 940;
  const cardH = isStories ? 1580 : 930;
  const cardX = (width - cardW) / 2;
  const cardY = isStories ? 180 : 80;
  const cardRadius = 36;

  // Sombra suave e profunda do cartão
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.22)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 20;

  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fillStyle = theme.paperBg;
  ctx.fill();
  ctx.restore();

  // Borda principal do cartão
  ctx.save();
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.stroke();
  ctx.restore();

  // ========================================================
  // 4. LINHAS PAUTADAS DE CADERNO ESCOLAR (DIÁRIO POP)
  // ========================================================
  ctx.save();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
  ctx.lineWidth = 1.5;
  const lineSpacing = isStories ? 44 : 40;
  const startLineY = cardY + 120;
  const endLineY = cardY + cardH - 120;

  for (let ly = startLineY; ly <= endLineY; ly += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(cardX + 28, ly);
    ctx.lineTo(cardX + cardW - 28, ly);
    ctx.stroke();
  }
  ctx.restore();

  // ========================================================
  // 5. BORDA COSTURADA DE SCRAPBOOK (STITCHES)
  // ========================================================
  ctx.save();
  ctx.strokeStyle = theme.stitchColor;
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  drawRoundedRect(ctx, cardX + 18, cardY + 18, cardW - 36, cardH - 36, cardRadius - 8);
  ctx.stroke();
  ctx.restore();

  // ========================================================
  // 6. FITA ADESIVA (WASHI TAPE) NO TOPO DO CARTÃO
  // ========================================================
  const washiW = 280;
  const washiH = 54;
  drawWashiTape(
    ctx,
    cardX + cardW / 2,
    cardY + 8,
    washiW,
    washiH,
    theme.washiColor,
    theme.washiText,
    '★ PÍLULA DE AFETO ★',
    -0.03
  );

  // ========================================================
  // 7. BADGE DA CATEGORIA
  // ========================================================
  const badgeY = cardY + (isStories ? 120 : 85);
  const badgeText = `✦ ${categoryLabel.toUpperCase()} ✦`;
  ctx.save();
  ctx.font = 'bold 22px "Outfit", sans-serif';
  const badgeMetrics = ctx.measureText(badgeText);
  const badgePadX = 26;
  const badgeW = badgeMetrics.width + badgePadX * 2;
  const badgeH = 44;
  const badgeX = (width - badgeW) / 2;

  ctx.fillStyle = theme.badgeBg;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 22);
  ctx.fill();

  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 22);
  ctx.stroke();

  ctx.fillStyle = theme.badgeText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, width / 2, badgeY + badgeH / 2);
  ctx.restore();

  // ========================================================
  // 8. ASPAS ESTILIZADAS DE ABERTURA
  // ========================================================
  const quoteMarkY = cardY + (isStories ? 240 : 175);
  ctx.save();
  ctx.font = '900 130px "Outfit", Georgia, serif';
  ctx.fillStyle = theme.quoteAccent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('“', width / 2, quoteMarkY);
  ctx.restore();

  // ========================================================
  // 9. TEXTO DO CONSELHO (AUTO-WRAP & ESCALONAMENTO)
  // ========================================================
  const maxQuoteWidth = cardW - 140;
  let quoteFontSize = isStories ? 48 : 42;
  if (quote.length > 120) quoteFontSize = isStories ? 42 : 36;
  if (quote.length > 180) quoteFontSize = isStories ? 36 : 30;

  ctx.save();
  ctx.font = `800 ${quoteFontSize}px "Outfit", -apple-system, sans-serif`;
  ctx.fillStyle = theme.quoteColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText(ctx, `"${quote}"`, maxQuoteWidth);
  const lineHeight = quoteFontSize * 1.48;
  const totalTextHeight = lines.length * lineHeight;

  const quoteCenterY = cardY + (isStories ? cardH * 0.44 : cardH * 0.43);
  const startQuoteY = quoteCenterY - totalTextHeight / 2 + lineHeight / 2;

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startQuoteY + idx * lineHeight);
  });
  ctx.restore();

  // ========================================================
  // 10. BADGE DO LIVRO DE ORIGEM
  // ========================================================
  const bookY = cardY + (isStories ? cardH * 0.65 : cardH * 0.64);
  const bookLabel = `📖 Do livro: ${bookOrigin}`;

  ctx.save();
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  const bookMetrics = ctx.measureText(bookLabel);
  const bookW = bookMetrics.width + 36;
  const bookH = 46;
  const bookX = (width - bookW) / 2;

  ctx.fillStyle = theme.bookBadgeBg;
  drawRoundedRect(ctx, bookX, bookY, bookW, bookH, 23);
  ctx.fill();

  ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, bookX, bookY, bookW, bookH, 23);
  ctx.stroke();

  ctx.fillStyle = theme.bookBadgeText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(bookLabel, width / 2, bookY + bookH / 2);
  ctx.restore();

  // ========================================================
  // 11. AUTÓGRAFO DIGITAL DE THALITA REBOUÇAS
  // ========================================================
  const signAreaY = cardY + (isStories ? cardH * 0.77 : cardH * 0.76);

  // Dedicatória
  ctx.save();
  ctx.font = 'italic 32px "Caveat", cursive';
  ctx.fillStyle = theme.signatureSubColor;
  ctx.textAlign = 'center';
  ctx.fillText('Com todo o meu amor,', width / 2, signAreaY);

  // Assinatura de Thalita
  ctx.font = 'bold 64px "Caveat", cursive';
  ctx.fillStyle = theme.signatureColor;
  ctx.fillText('Thalita Rebouças', width / 2 - 40, signAreaY + 54);

  // Coração autoral vetorizado conectado à assinatura
  const sigMetrics = ctx.measureText('Thalita Rebouças');
  const sigEndX = width / 2 - 40 + sigMetrics.width / 2;
  drawThalitaSignatureHeart(ctx, sigEndX - 10, signAreaY + 48, theme.heartColor);

  ctx.restore();

  // ========================================================
  // 12. RODAPÉ DO CARD / WATERMARK
  // ========================================================
  const footerY = cardY + cardH - (isStories ? 60 : 45);
  ctx.save();
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = theme.signatureSubColor;
  ctx.globalAlpha = 0.85;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isStories) {
    ctx.fillText('✦ Universo Interativo · thalitareboucas.com.br ✦', width / 2, footerY - 24);
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.cardBorder;
    ctx.fillText('Marque @thalitareboucas nas suas redes! 💖', width / 2, footerY + 8);
  } else {
    ctx.fillText('✦ thalitareboucas.com.br · Marque @thalitareboucas ✦', width / 2, footerY);
  }
  ctx.restore();

  return canvas;
}

/**
 * Converte o Canvas em um Blob de Imagem (PNG)
 */
export async function generateAdviceCardBlob(
  options: CardRenderOptions
): Promise<Blob> {
  const canvas = await generateAdviceCardCanvas(options);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Falha ao gerar o Blob da imagem no Canvas.'));
      }
    }, 'image/png');
  });
}

/**
 * Gera DataURL do card para pré-visualização rápida ou download
 */
export async function generateAdviceCardDataUrl(
  options: CardRenderOptions
): Promise<string> {
  const canvas = await generateAdviceCardCanvas(options);
  return canvas.toDataURL('image/png');
}

/**
 * Dispara o download automático do card como arquivo PNG
 */
export async function downloadAdviceCard(
  options: CardRenderOptions,
  customFilename?: string
): Promise<boolean> {
  try {
    const blob = await generateAdviceCardBlob(options);
    const url = URL.createObjectURL(blob);

    const formatSlug = options.format === '9:16' ? 'stories' : 'feed';
    const cleanCategory = options.categoryLabel
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');

    const filename =
      customFilename || `conselho-thalita-${cleanCategory}-${formatSlug}.png`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoga a URL após pequeno intervalo
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);

    return true;
  } catch (err) {
    console.error('Erro ao baixar o card:', err);
    return false;
  }
}

/**
 * Copia a imagem do card diretamente para a área de transferência do usuário
 */
export async function copyAdviceCardImageToClipboard(
  options: CardRenderOptions
): Promise<boolean> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      return false;
    }

    const blob = await generateAdviceCardBlob(options);
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Erro ao copiar imagem para clipboard:', err);
    return false;
  }
}

/**
 * Copia a frase do conselho formatada com citação
 */
export async function copyAdviceTextToClipboard(
  quote: string,
  bookOrigin: string
): Promise<boolean> {
  try {
    const text = `"${quote}" — Thalita Rebouças (do livro "${bookOrigin}") ✨\nDescubra mais em: https://thalitareboucas.com.br`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
    return false;
  }
}

/**
 * Compartilha o Card via Web Share API se suportado (Mobile / Desktop moderno)
 */
export async function shareAdviceCard(
  options: CardRenderOptions
): Promise<boolean> {
  try {
    const blob = await generateAdviceCardBlob(options);
    const formatSlug = options.format === '9:16' ? 'stories' : 'feed';
    const file = new File([blob], `conselho-thalita-${formatSlug}.png`, {
      type: 'image/png',
    });

    const shareData: ShareData = {
      title: 'Conselho da Thalita Rebouças',
      text: `"${options.quote}" — Thalita Rebouças (${options.bookOrigin}) ✨`,
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        ...shareData,
        files: [file],
      });
      return true;
    }

    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    }

    return false;
  } catch (err) {
    // Erros de cancelamento de compartilhamento pelo usuário não são falhas do sistema
    if ((err as Error)?.name === 'AbortError') {
      return true;
    }
    console.error('Erro no compartilhamento nativo:', err);
    return false;
  }
}
