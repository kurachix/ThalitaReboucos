import React, { useState } from 'react';
import { QUIZ_QUESTIONS, calculateQuizResult } from '@/data/quiz';
import { CharacterId, QuizCharacterResult } from '@/types';
import { QuizQuestionCard } from './QuizQuestionCard';
import { QuizResultCard } from './QuizResultCard';
import { useAppStore } from '@/store/use-app-store';
import { Sparkles } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const unlockAchievement = useAppStore((state) => state.unlockAchievement);

  // Estado do Quiz
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, { optionId: string; affinity: CharacterId }>
  >({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<QuizCharacterResult | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const currentSelectedOption = selectedAnswers[currentIndex]?.optionId || null;

  // Seleção de uma opção na pergunta atual
  const handleSelectOption = (optionId: string, affinity: CharacterId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: { optionId, affinity },
    }));
  };

  // Avançar para a próxima pergunta ou finalizar
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Cálculo determinístico do resultado final
      const affinities: CharacterId[] = Object.values(selectedAnswers).map(
        (ans) => ans.affinity
      );
      const computedResult = calculateQuizResult(affinities);
      setFinalResult(computedResult);
      setIsCompleted(true);
      unlockAchievement('completed_quiz');
    }
  };

  // Voltar para a pergunta anterior
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Reiniciar o Quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setFinalResult(null);
  };

  const stepLabels = ['O Bafafá', 'Sábado dos Sonhos', 'Bronca de Mãe'];

  return (
    <section 
      id="quiz" 
      className="scroll-mt-24 py-8 sm:py-12"
      aria-label="Ato 6: Quiz Interativo Qual Personagem de Thalita Rebouças É Você"
    >
      {/* =================================================================== */}
      {/* CABEÇALHO DA SEÇÃO                                                  */}
      {/* =================================================================== */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold uppercase tracking-wider shadow-sticker">
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>Ato 6 · Mini-Jogo de Afinidade das Leitoras</span>
        </div>

        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 font-heading tracking-tight">
          Qual Personagem de Thalita Rebouças É Você?
        </h2>

        <p className="text-slate-600 font-body text-base sm:text-lg">
          Malu, Tetê, Gabi ou Rosa? Responda a 3 perguntinhas no clássico estilo "bilhete passado por baixo da carteira" e descubra qual heroína dos livros mais se parece com você!
        </p>
      </div>

      {/* =================================================================== */}
      {/* STEPPER DE PROGRESSO LÚDICO (ESTILO RÉGUA ESCOLAR)                  */}
      {/* =================================================================== */}
      {!isCompleted && (
        <div className="max-w-md mx-auto mb-8 px-4">
          <div className="flex items-center justify-between relative">
            {/* Linha de Conexão */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-pop-pink -translate-y-1/2 z-0 rounded-full transition-all duration-300"
              style={{
                width: `${(currentIndex / (totalQuestions - 1)) * 100}%`,
              }}
            />

            {/* Marcadores dos Passos */}
            {stepLabels.map((label, idx) => {
              const isPassed = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-extrabold text-xs shadow-md transition-all duration-300 ${
                      isCurrent
                        ? 'bg-pop-pink text-white ring-4 ring-pink-100 scale-110'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>

                  <span className={`text-[11px] font-heading font-bold mt-2 hidden sm:block ${
                    isCurrent ? 'text-pop-pink' : 'text-slate-500'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CARTÕES DO QUIZ: PERGUNTA ATIVA OU RESULTADO FINAL                   */}
      {/* =================================================================== */}
      <div className="relative px-3 sm:px-4">
        {!isCompleted ? (
          <QuizQuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            currentNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            selectedOptionId={currentSelectedOption}
            onSelectOption={handleSelectOption}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentIndex === 0}
            isLast={currentIndex === totalQuestions - 1}
          />
        ) : (
          finalResult && (
            <QuizResultCard
              result={finalResult}
              onRestart={handleRestart}
            />
          )
        )}
      </div>

    </section>
  );
};
