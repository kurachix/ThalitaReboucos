import { QuizQuestion, QuizCharacterResult, CharacterId } from '@/types';

export const QUIZ_CHARACTERS: Record<CharacterId, QuizCharacterResult> = {
  malu: {
    id: 'malu',
    name: 'Malu (Maria de Lourdes)',
    bookSource: 'Fala Sério, Mãe!',
    catchphrase: 'Fala sério, mãe! Eu não acredito que você falou isso na frente de todo mundo!',
    description: 'Espontânea, cheia de tiradas rápidas e com um coração gigante. Você pode até brigar com quem ama por bobagem, mas é a primeira a pedir desculpas com uma piada ou um abraço apertado.',
    traits: ['Expressiva', 'Humor Ácido', 'Muito Afetuosa', 'Dramática na Medida Certa'],
    badgeColor: '#FF2A85',
  },
  tete: {
    id: 'tete',
    name: 'Tetê (Maria Tereza)',
    bookSource: 'Confissões de uma Garota Excluída',
    catchphrase: 'Ser autêntica é difícil, mas fingir ser outra pessoa cansa muito mais.',
    description: 'Observadora, inteligente e um pouco desajeitada em situações sociais. Você valoriza amizades leais mais do que qualquer popularidade vazia e tem um talento único para confortar os outros.',
    traits: ['Sensível', 'Leal', 'Autêntica', 'Mente Criativa'],
    badgeColor: '#9B51E0',
  },
  gabi: {
    id: 'gabi',
    name: 'Gabi (Gabriela)',
    bookSource: 'Tudo por um Popstar',
    catchphrase: 'Amiga, a gente VAI conseguir esse ingresso nem que precise atravessar o estado!',
    description: 'A líder nata das aventuras do grupo! Se você tem um objetivo ou uma paixão musical, ninguém segura. Energia contagiante, coragem inabalável e sempre pronta para a próxima loucura.',
    traits: ['Intensa', 'Super Determinada', 'Alma da Festa', 'Fiel às Amigas'],
    badgeColor: '#FFD13B',
  },
  rosa: {
    id: 'rosa',
    name: 'Rosa',
    bookSource: 'Ela Disse, Ele Disse',
    catchphrase: 'Eu tenho argumentos, senso crítico e não engulo desaforo de gente mimada.',
    description: 'Segura de si, sincera e defensora da justiça. Não tem paciência para hipocrisia, fala o que pensa com elegância e não deixa ninguém diminuir suas opiniões.',
    traits: ['Firme', 'Justa', 'Elegante', 'Personalidade Forte'],
    badgeColor: '#00B4D8',
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    title: 'Como você reage quando descobre um bafafá daqueles no grupo de amigos ou no colégio?',
    options: [
      {
        id: 'q1-malu',
        text: 'Ligo na hora pra minha melhor amiga gritando: "AMIGA DO CÉU, VOCÊ NÃO SABE O QUE ACONTECEU!"',
        characterAffinity: 'malu',
      },
      {
        id: 'q1-tete',
        text: 'Fico quieta no meu canto analisando todos os fatos antes de tirar qualquer conclusão precipitada.',
        characterAffinity: 'tete',
      },
      {
        id: 'q1-gabi',
        text: 'Já monto uma força-tarefa com os amigos para investigar a história inteira nos mínimos detalhes!',
        characterAffinity: 'gabi',
      },
      {
        id: 'q1-rosa',
        text: 'Vou direto na fonte da história porque detesto telefone sem fio e fofoca distorcida.',
        characterAffinity: 'rosa',
      },
    ],
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Qual é a sua definição de um sábado à tarde dos sonhos?',
    options: [
      {
        id: 'q2-malu',
        text: 'Dar risada até a barriga doer no shopping comendo batata frita e reclamando de crushes.',
        characterAffinity: 'malu',
      },
      {
        id: 'q2-tete',
        text: 'Cama quentinha, um livro maravilhoso, comida gostosa feita pelos avós e playlist favorita.',
        characterAffinity: 'tete',
      },
      {
        id: 'q2-gabi',
        text: 'Show da banda favorita, cantar até ficar rouca com a galera e pular sem parar!',
        characterAffinity: 'gabi',
      },
      {
        id: 'q2-rosa',
        text: 'Um café aconchegante conversando sobre cinema, música ou projetos futuros com quem entende a minha vibe.',
        characterAffinity: 'rosa',
      },
    ],
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Como é a sua reação típica diante de uma bronca daqueles dias da sua mãe?',
    options: [
      {
        id: 'q3-malu',
        text: 'Reviro os olhos, solto um "Fala sério!", mas 15 minutos depois já vou na cozinha pedir um lanche com voz manhosa.',
        characterAffinity: 'malu',
      },
      {
        id: 'q3-tete',
        text: 'Fico reflexiva, me tranco no quarto escrevendo no diário e pensando em como todo mundo me acha dramática.',
        characterAffinity: 'tete',
      },
      {
        id: 'q3-gabi',
        text: 'Tento contornar a situação com lábia, bom humor e prometo mundos e fundos pra não ficar de castigo.',
        characterAffinity: 'gabi',
      },
      {
        id: 'q3-rosa',
        text: 'Respondo ponto a ponto com argumentos lógicos até provar meu ponto com serenidade.',
        characterAffinity: 'rosa',
      },
    ],
  },
];

/**
 * Calcula o personagem com maior pontuação com base nas respostas dadas.
 */
export function calculateQuizResult(selectedOptionAffinities: CharacterId[]): QuizCharacterResult {
  const counts: Record<CharacterId, number> = {
    malu: 0,
    tete: 0,
    gabi: 0,
    rosa: 0,
  };

  selectedOptionAffinities.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });

  let winningCharacter: CharacterId = 'malu';
  let maxCount = -1;

  (Object.keys(counts) as CharacterId[]).forEach((charId) => {
    if (counts[charId] > maxCount) {
      maxCount = counts[charId];
      winningCharacter = charId;
    }
  });

  return QUIZ_CHARACTERS[winningCharacter];
}
