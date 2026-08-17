import type { Cadence, ContentType } from '../types';

/** Takte, in denen eine Gewohnheit laufen kann. */
export const CADENCES: Cadence[] = ['täglich', '3x/Woche', 'wöchentlich'];

export const TYPE_LABEL: Record<ContentType, string> = {
  buch: '📕 Buch',
  hörbuch: '🎧 Hörbuch',
  artikel: '📄 Artikel',
  podcast: '🎙 Podcast',
  video: '▶ Video',
  serie: '📺 Serie',
};

export const CONTENT_TYPES = Object.keys(TYPE_LABEL) as ContentType[];
