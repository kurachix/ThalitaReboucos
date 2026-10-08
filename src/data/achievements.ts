/**
 * Catálogo de Selos do Passaporte da Leitora
 * Rastreia as 6 experiências interativas fundamentais da plataforma.
 */

export interface AchievementStamp {
  id: string;
  title: string;
  category: string;
  description: string;
  hint: string;
  emoji: string;
  actSectionId: string;
  stampColor: string; // Cor do carimbo de tinta
}

export const PASSPORT_ACHIEVEMENTS: AchievementStamp[] = [
  {
    id: 'typed_manifesto',
    title: 'Datilógrafa Pop',
    category: 'Ateliê Carioca',
    description: 'Digitou a frase-manifesto na máquina de escrever vintage da autora.',
    hint: 'Experimente pressionar as teclas ou clicar em "Auto-Digitar" na máquina do Ateliê!',
    emoji: '✍️',
    actSectionId: 'hero',
    stampColor: '#FF2A85', // Pop Pink
  },
  {
    id: 'opened_book',
    title: 'Leitora de Primeira',
    category: 'Estante Pop',
    description: 'Folheou um exemplar do acervo e explorou os bastidores da obra.',
    hint: 'Escolha e clique em qualquer livro na Estante Pop para abrir o leitor imersivo!',
    emoji: '📖',
    actSectionId: 'bookshelf',
    stampColor: '#FF7A00', // Tangerine
  },
  {
    id: 'clapped_board',
    title: 'Diretora de Cinema',
    category: 'Cine-Thalita',
    description: 'Bateu a claquete cinematográfica e acendeu o projetor de estreias.',
    hint: 'Clique ou puxe a haste móvel da claquete no Cine-Thalita para gravar a tomada!',
    emoji: '🎬',
    actSectionId: 'cinema',
    stampColor: '#1E293B', // Ink Dark
  },
  {
    id: 'spun_slot',
    title: 'Caça-Conselhos',
    category: 'Máquina Afetiva',
    description: 'Puxou a alavanca mecânica e sorteou uma dose de humor e afeto.',
    hint: 'Puxe a alavanca vermelha do caça-níqueis para retirar sua pílula do dia!',
    emoji: '🎰',
    actSectionId: 'advices',
    stampColor: '#E5B41C', // Sun Yellow Dark
  },
  {
    id: 'completed_quiz',
    title: 'Espelho da Autora',
    category: 'Quiz Pop',
    description: 'Respondeu as perguntas do bilhete escolar e descobriu sua personagem.',
    hint: 'Responda as 3 perguntas do Quiz para descobrir se você é Malu, Tetê ou Gabi!',
    emoji: '💖',
    actSectionId: 'quiz',
    stampColor: '#9333EA', // Purple
  },
  {
    id: 'pinned_note',
    title: 'Voz da Bienal',
    category: 'Mural dos Fãs',
    description: 'Pregou seu próprio bilhete carinhoso na parede de cortiça.',
    hint: 'Clique em "Deixar meu Recado" no Mural dos Fãs e espete seu post-it!',
    emoji: '📌',
    actSectionId: 'fan-wall',
    stampColor: '#00B4D8', // Sea Blue
  },
];
