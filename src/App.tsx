import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/hero/HeroSection';
import { TimelineSection } from '@/components/timeline/TimelineSection';
import { BookshelfSection } from '@/components/bookshelf/BookshelfSection';
import { CinemaSection } from '@/components/cinema/CinemaSection';
import { AdviceMachineSection } from '@/components/advice-machine/AdviceMachineSection';
import { QuizSection } from '@/components/quiz/QuizSection';
import { FanWallSection } from '@/components/fan-wall/FanWallSection';
import { useDeviceCapability } from '@/hooks/use-device-capability';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';

export default function App() {
  // Inicializa detecção de capacidade de hardware, conexão e touch
  useDeviceCapability();

  // Inicializa atalhos globais de teclado (Modo Power-User & Acessibilidade)
  useKeyboardNavigation();

  return (
    <AppShell>
      {/* SEÇÃO 1: HERO — O ATELIÊ DA AUTORA */}
      <HeroSection />

      {/* SEÇÃO 2: TIMELINE — ÁLBUM DE MEMÓRIAS */}
      <div className="content-visibility-auto">
        <TimelineSection />
      </div>

      {/* SEÇÃO 3: BOOKSHELF — A ESTANTE POP */}
      <div className="content-visibility-auto">
        <BookshelfSection />
      </div>

      {/* SEÇÃO 4: CINEMA — CINE-THALITA */}
      <div className="content-visibility-auto">
        <CinemaSection />
      </div>

      {/* SEÇÃO 5: ADVICES — MÁQUINA DE CONSELHOS */}
      <div className="content-visibility-auto">
        <AdviceMachineSection />
      </div>

      {/* SEÇÃO 6: QUIZ — QUAL PERSONAGEM DE THALITA REBOUÇAS É VOCÊ? */}
      <div className="content-visibility-auto">
        <QuizSection />
      </div>

      {/* SEÇÃO 7: FAN-WALL — MURAL DOS FÃS DA BIENAL */}
      <div className="content-visibility-auto">
        <FanWallSection />
      </div>
    </AppShell>
  );
}
