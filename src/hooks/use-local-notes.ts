import { useState, useEffect, useCallback } from 'react';
import { FanNote, NoteColor } from '@/types';
import { DEFAULT_FAN_NOTES } from '@/data/fan-wall';

const STORAGE_KEY = 'thalita_fan_wall_notes_v1';

export interface NewNoteInput {
  name: string;
  city: string;
  message: string;
  color: NoteColor;
  pinnedBook?: string;
}

/**
 * Sanitiza e valida o texto para prevenir injeção de HTML e scripts
 */
export function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>?/gm, '') // Remove tags HTML/scripts
    .replace(/\s+/g, ' ')      // Normaliza múltiplos espaços
    .trim();
}

/**
 * Gera uma rotação orgânica aleatória entre -3.2° e 3.4°
 */
function generateOrganicRotation(): number {
  const min = -3.2;
  const max = 3.4;
  const raw = Math.random() * (max - min) + min;
  return Number(raw.toFixed(1));
}

export function useLocalNotes() {
  const [notes, setNotes] = useState<FanNote[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_FAN_NOTES;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FanNote[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Falha ao ler notas do localStorage:', err);
    }

    return DEFAULT_FAN_NOTES;
  });

  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Sincroniza com o localStorage sempre que houver alteração
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (err) {
      console.warn('Falha ao salvar notas no localStorage:', err);
    }
  }, [notes]);

  /**
   * Adiciona um novo recado com validação e sanitização estrita
   */
  const addNote = useCallback((input: NewNoteInput): FanNote => {
    const cleanName = sanitizeInput(input.name).slice(0, 40);
    const cleanCity = sanitizeInput(input.city).slice(0, 40);
    const cleanMessage = sanitizeInput(input.message).slice(0, 140);
    const cleanBook = input.pinnedBook ? sanitizeInput(input.pinnedBook).slice(0, 50) : undefined;

    const newNote: FanNote = {
      id: `user-note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName || 'Leitor(a) Anônimo(a)',
      city: cleanCity || 'Brasil',
      message: cleanMessage,
      color: input.color,
      createdAt: new Date().toISOString().split('T')[0],
      rotationDeg: generateOrganicRotation(),
      likes: 1,
      pinnedBook: cleanBook,
    };

    setNotes((prev) => [newNote, ...prev]);
    setRecentlyAddedId(newNote.id);

    // Remove a classe de destaque após alguns segundos
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 4500);

    return newNote;
  }, []);

  /**
   * Incrementa ou decrementa curtida em um recado
   */
  const likeNote = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return { ...n, likes: (n.likes || 0) + 1 };
        }
        return n;
      })
    );
  }, []);

  /**
   * Restaura o mural para a curadoria padrão
   */
  const resetToDefault = useCallback(() => {
    setNotes(DEFAULT_FAN_NOTES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return {
    notes,
    addNote,
    likeNote,
    resetToDefault,
    recentlyAddedId,
  };
}
