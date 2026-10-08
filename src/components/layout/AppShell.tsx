import React from 'react';
import { Header } from '@/components/common/Header';
import { FloatingStickersLayer } from '@/components/common/FloatingStickersLayer';
import { KeyboardShortcutsModal } from '@/components/common/KeyboardShortcutsModal';
import { ReaderPassport } from '@/components/gamification/ReaderPassport';
import { CustomCursor } from '@/components/common/CustomCursor';
import { StructuredData } from '@/components/seo/StructuredData';
import { Heart, Sparkles, BookOpen, Instagram, Twitter } from 'lucide-react';
import { THALITA_PROFILE } from '@/data/biography';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-paper-ruled text-slate-800 antialiased overflow-x-hidden selection:bg-pink-200 selection:text-pink-900 relative">
      
      {/* Cursor Customizado Reativo com Trilha Mágica de Brilhos (Desktop) */}
      <CustomCursor />

      {/* Modal Global de Atalhos de Teclado (Modo Power-User) */}
      <KeyboardShortcutsModal />

      {/* Gamificação: Passaporte da Leitora (Rastreador de Exploração & Selos) */}
      <ReaderPassport />
      
      {/* Dados Estruturados Schema.org JSON-LD para SEO e Google Rich Results */}
      <StructuredData />

      {/* Luz e Gradientes Atmosféricos Cariocas de Fundo */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 15%, rgba(255, 209, 59, 0.25) 0%, transparent 40%),
            radial-gradient(circle at 90% 45%, rgba(255, 42, 133, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 20% 85%, rgba(0, 180, 216, 0.18) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Camada de Adesivos Holográficos Arrastáveis (Draggable Pop Stickers) */}
      <FloatingStickersLayer />

      {/* Header Fixo com Glassmorphism */}
      <Header />

      {/* Área de Conteúdo Principal (Centralizador das 7 Seções) */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 sm:space-y-24">
        {children}
      </main>

      {/* Rodapé Scrapbook Afetivo com Suporte a Safe Area em Telas Móveis */}
      <footer className="relative z-10 w-full bg-white/90 backdrop-blur-md border-t border-amber-200/60 mt-20 pt-12 pb-8 safe-area-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-100">
            
            {/* Bloco da Autora */}
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sun-yellow to-pop-pink flex items-center justify-center shadow-xs">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="font-heading font-black text-xl text-slate-900 tracking-tight">
                  Thalita Rebouças
                </span>
              </div>
              <p className="font-handwriting text-xl text-slate-600 max-w-md">
                "{THALITA_PROFILE.manifesto}"
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-semibold text-slate-500 pt-1">
                <span className="bg-amber-100/80 text-amber-800 px-2.5 py-0.5 rounded-full">
                  {THALITA_PROFILE.booksSold}
                </span>
                <span className="bg-pink-100/80 text-pink-800 px-2.5 py-0.5 rounded-full">
                  {THALITA_PROFILE.publishedCount}
                </span>
                <span className="bg-sky-100/80 text-sky-800 px-2.5 py-0.5 rounded-full">
                  {THALITA_PROFILE.adaptationsCount}
                </span>
              </div>
            </div>

            {/* Redes Sociais Oficiais */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Conecte-se com a Thalita
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={THALITA_PROFILE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Thalita Rebouças"
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-pink-50 border border-slate-200 hover:border-pink-300 text-slate-600 hover:text-pop-pink flex items-center justify-center transition-colors shadow-xs"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={THALITA_PROFILE.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X de Thalita Rebouças"
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-sea-blue flex items-center justify-center transition-colors shadow-xs"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={THALITA_PROFILE.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok de Thalita Rebouças"
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
                >
                  <Sparkles className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Copyright e Nota Afetiva */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left font-body">
            <p>
              © {new Date().getFullYear()} Ateliê Thalita Rebouças. Feito com afeto carioca para leitores e fãs.
            </p>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <BookOpen className="w-4 h-4 text-pop-pink" />
              <span>Experiência Digital 100% Interativa</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
