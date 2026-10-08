import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/hero/HeroSection';
import { TimelineSection } from '@/components/timeline/TimelineSection';
import { BookshelfSection } from '@/components/bookshelf/BookshelfSection';
import { CinemaSection } from '@/components/cinema/CinemaSection';
import { AdviceMachineSection } from '@/components/advice-machine/AdviceMachineSection';
import { QuizSection } from '@/components/quiz/QuizSection';
import { FanWallSection } from '@/components/fan-wall/FanWallSection';

export default function App() {
  return (
    <AppShell>
      {/* SEÇÃO 1: HERO — O ATELIÊ DA AUTORA */}
      <HeroSection />

      {/* SEÇÃO 2: TIMELINE — ÁLBUM DE MEMÓRIAS */}
      <TimelineSection />

      {/* SEÇÃO 3: BOOKSHELF — A ESTANTE POP */}
      <BookshelfSection />

      {/* SEÇÃO 4: CINEMA — CINE-THALITA */}
      <CinemaSection />

      {/* SEÇÃO 5: ADVICES — MÁQUINA DE CONSELHOS */}
      <AdviceMachineSection />

      {/* SEÇÃO 6: QUIZ — QUAL PERSONAGEM DE THALITA REBOUÇAS É VOCÊ? */}
      <QuizSection />

      {/* SEÇÃO 7: FAN-WALL — MURAL DOS FÃS DA BIENAL */}
      <FanWallSection />
    </AppShell>
  );
}
