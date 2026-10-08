import React from 'react';
import { QuizQuestion, CharacterId } from '@/types';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export interface QuizQuestionCardProps {
  question: QuizQuestion;
  currentNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string, affinity: CharacterId) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const OPTION_ACCENT_COLORS = [
  { border: 'hover:border-pop-pink', bg: 'bg-pink-50', text: 'text-pop-pink', ring: 'ring-pop-pink' },
  { border: 'hover:border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-500' },
  { border: 'hover:border-sun-yellow-dark', bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-500' },
  { border: 'hover:border-sea-blue', bg: 'bg-sky-50', text: 'text-sea-blue-dark', ring: 'ring-sea-blue' },
];

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  currentNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const { playClick, playPageFlip } = useAudio();
  const prefersReduced = useReducedMotion();

  const handleOptionClick = (optionId: string, affinity: CharacterId) => {
    playClick();
    onSelectOption(optionId, affinity);
  };

  const handleAdvance = () => {
    playPageFlip();
    onNext();
  };

  const handleBack = () => {
    playClick();
    onPrevious();
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto transition-all duration-300 ${
        prefersReduced ? 'opacity-100' : 'animate-fade-in'
      }`}
    >
      {/* =================================================================== */}
      {/* ESTRUTURA DO BILHETE ESCOLAR DE SCRAPBOOK                           */}
      {/* =================================================================== */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-scrapbook border-3 border-amber-200/90 overflow-hidden">
        
        {/* Fita Adesiva Decorativa (Washi Tape) no Topo do Bilhete */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-sun-yellow/90 backdrop-blur-xs text-amber-950 text-xs font-heading font-extrabold uppercase tracking-widest rounded-xs shadow-xs rotate-[-1.5deg] z-20">
          ★ BILHETE ESCOLAR #{currentNumber} ★
        </div>

        {/* Linhas Pautadas de Caderno de Fundo */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(203, 213, 225, 0.7) 32px)',
          }}
        />

        {/* Marcadores de Furinhos de Caderno Espiral na Esquerda */}
        <div className="hidden sm:flex absolute left-3 top-8 bottom-8 flex-col justify-between pointer-events-none opacity-40">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400/50 shadow-inner" />
          ))}
        </div>

        {/* ======================================================== */}
        {/* CABEÇALHO DO BILHETE: PROGRESSO E NÚMERO DA PERGUNTA     */}
        {/* ======================================================== */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-amber-100 text-xs font-mono sm:pl-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-pop-pink uppercase tracking-wider">
              Pergunta {currentNumber} de {totalQuestions}
            </span>
          </div>

          {/* Indicadores Visuais de Progresso (Coraçõezinhos) */}
          <div className="flex items-center gap-1.5" aria-label={`Progresso: pergunta ${currentNumber} de ${totalQuestions}`}>
            {[...Array(totalQuestions)].map((_, idx) => {
              const isPastOrCurrent = idx < currentNumber;
              return (
                <span
                  key={idx}
                  className={`text-sm transition-transform duration-300 ${
                    idx + 1 === currentNumber ? 'scale-125 text-pop-pink animate-pulse' : ''
                  } ${
                    isPastOrCurrent ? 'text-pop-pink' : 'text-slate-300'
                  }`}
                >
                  ♥
                </span>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* O ENUNCIADO DA PERGUNTA                                  */}
        {/* ======================================================== */}
        <div className="relative z-10 my-6 sm:pl-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pop-pink text-xs font-bold font-heading mb-3 shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Dilema das Heroínas</span>
          </div>

          <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-slate-900 leading-snug">
            {question.title}
          </h3>
        </div>

        {/* ======================================================== */}
        {/* AS 4 OPÇÕES DE RESPOSTA ESTILO BILHETE                   */}
        {/* ======================================================== */}
        <div className="relative z-10 space-y-3 sm:pl-4" role="radiogroup" aria-label={question.title}>
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const accent = OPTION_ACCENT_COLORS[idx % OPTION_ACCENT_COLORS.length];

            return (
              <div
                key={option.id}
                role="radio"
                tabIndex={0}
                aria-checked={isSelected}
                onClick={() => handleOptionClick(option.id, option.characterAffinity)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionClick(option.id, option.characterAffinity);
                  }
                }}
                className={`group cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all select-none flex items-start gap-3.5 focus:outline-none focus:ring-4 focus:ring-pink-300 ${
                  isSelected
                    ? `border-pop-pink bg-pink-50/80 shadow-md ${
                        prefersReduced ? '' : 'scale-[1.01]'
                      }`
                    : `border-slate-200 bg-white/90 hover:bg-slate-50/90 hover:shadow-xs ${accent.border} ${
                        prefersReduced ? '' : 'hover:-translate-y-0.5'
                      }`
                }`}
              >
                {/* Letra da Opção em Selo / Carimbo */}
                <div
                  className={`w-8 h-8 rounded-xl font-heading font-extrabold text-sm flex items-center justify-center shrink-0 transition-colors shadow-xs ${
                    isSelected
                      ? 'bg-pop-pink text-white shadow-sm'
                      : 'bg-slate-100 group-hover:bg-amber-100 text-slate-700'
                  }`}
                >
                  {isSelected ? <CheckCircle2 className="w-4 h-4 text-white" /> : OPTION_LETTERS[idx]}
                </div>

                {/* Texto da Opção com Tipografia Aconchegante */}
                <div className="flex-1 pt-0.5">
                  <p 
                    className={`font-body text-sm sm:text-base leading-relaxed ${
                      isSelected ? 'font-bold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {option.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* RODAPÉ DO BILHETE: NAVEGAÇÃO DE PERGUNTAS                */}
        {/* ======================================================== */}
        <div className="relative z-10 mt-8 pt-4 border-t border-amber-100 flex items-center justify-between sm:pl-4">
          {/* Botão Voltar */}
          {!isFirst ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-heading font-bold transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Pergunta Anterior</span>
            </button>
          ) : (
            <span className="text-[11px] font-handwriting text-slate-400 text-base">
              Escolha com o coração 💖
            </span>
          )}

          {/* Botão Próxima / Finalizar */}
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={handleAdvance}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-heading font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 ${
              selectedOptionId
                ? 'bg-gradient-to-r from-pop-pink to-purple-600 hover:from-pop-pink-dark hover:to-purple-700 text-white shadow-pop-pink/30 hover:scale-105'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{isLast ? 'Ver Meu Resultado! ✨' : 'Próxima Pergunta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
