/**
 Contratos de Dados do Universo Thalita Rebouças
 * Tipagem estrita para entidades do projeto sem uso de 'any'.
 */

export type BookCategory = 
  | 'todos'
  | 'fala-serio'
  | 'popstar'
  | 'confissoes'
  | 'romances-e-outros';

export interface Book {
  id: string;
  title: string;
  year: number;
  category: Exclude<BookCategory, 'todos'>;
  synopsis: string;
  trivia: string;
  pages: number;
  highlightQuote: string;
  coverAccent: string; // Cor de destaque do livro no design
  coverUrl?: string; // Link direto para a imagem oficial da capa na web
  tags: string[];
  publisher?: string;
  excerpt?: string;
}

export type StreamingPlatform = 'cinema' | 'netflix' | 'prime-video';

export interface Movie {
  id: string;
  title: string;
  year: number;
  platform: StreamingPlatform;
  platformLabel: string;
  director: string;
  cast: string[];
  highlight: string;
  synopsis: string;
  trailerId?: string; // YouTube video ID para exibição leve
  posterUrl?: string; // Link direto para o cartaz oficial do filme
  badgeColor: string;
  trivia?: string; // Curiosidades e bastidores contados pela autora
  duration?: string;
  backdropColor?: string;
}

export type MilestoneType = 
  | 'childhood' 
  | 'rejection' 
  | 'bestseller' 
  | 'bienal' 
  | 'cinema' 
  | 'global-streaming';

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: MilestoneType;
  polaroidCaption: string;
  badge: string;
  stickerId?: string;
}

export type AdviceCategory = 'mae' | 'amizade' | 'amor-proprio' | 'drama' | 'humor';

export interface AdviceQuote {
  id: string;
  quote: string;
  category: AdviceCategory;
  categoryLabel: string;
  bookOrigin: string;
  iconName: string;
}

export type CharacterId = 'malu' | 'tete' | 'gabi' | 'rosa';

export interface QuizCharacterResult {
  id: CharacterId;
  name: string;
  bookSource: string;
  catchphrase: string;
  description: string;
  traits: string[];
  badgeColor: string;
}

export interface QuizOption {
  id: string;
  text: string;
  characterAffinity: CharacterId;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  title: string;
  options: QuizOption[];
}

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'mint' | 'purple';

export interface FanNote {
  id: string;
  name: string;
  city: string;
  message: string;
  color: NoteColor;
  createdAt: string;
  rotationDeg: number;
  likes?: number;
  pinnedBook?: string;
}

export interface BienalMemory {
  id: string;
  year: string;
  title: string;
  description: string;
  caption: string;
  durationHours: number;
  tag: string;
  rotationDeg: number;
  accentColor: string;
}

