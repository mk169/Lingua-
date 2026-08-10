/** Sprachausgabe und Spracherkennung über die Web Speech API. */

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string, langCode: string, rate = 0.9): void {
  if (!ttsSupported()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  utter.rate = rate;
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (ttsSupported()) window.speechSynthesis.cancel();
}

type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function recognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, SpeechRecognitionCtor | undefined>;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function sttSupported(): boolean {
  return recognitionCtor() !== null;
}

export interface Recorder {
  stop(): void;
}

/** Startet die Diktierfunktion. Liefert Zwischen- und Endergebnisse. */
export function listen(
  langCode: string,
  handlers: {
    onResult: (text: string, final: boolean) => void;
    onError?: (message: string) => void;
    onEnd?: () => void;
  },
): Recorder | null {
  const Ctor = recognitionCtor();
  if (!Ctor) {
    handlers.onError?.('Spracherkennung wird von diesem Browser nicht unterstützt.');
    return null;
  }
  const rec = new Ctor();
  rec.lang = langCode;
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  rec.onresult = (event) => {
    let text = '';
    for (let i = 0; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }
    handlers.onResult(text, false);
  };
  rec.onerror = (e) => {
    const messages: Record<string, string> = {
      'not-allowed': 'Mikrofonzugriff verweigert.',
      'no-speech': 'Nichts gehört. Bitte nochmal.',
      network: 'Netzwerkfehler bei der Spracherkennung.',
    };
    handlers.onError?.(messages[e.error] ?? `Fehler: ${e.error}`);
  };
  rec.onend = () => handlers.onEnd?.();

  try {
    rec.start();
  } catch {
    handlers.onError?.('Aufnahme konnte nicht gestartet werden.');
    return null;
  }
  return { stop: () => rec.stop() };
}

/** Grobe Ähnlichkeit zweier Strings (0–1) – für Aussprache-Feedback. */
export function similarity(a: string, b: string): number {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .trim()
      .replace(/\s+/g, ' ');
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return 0;
  if (x === y) return 1;

  const m = x.length;
  const n = y.length;
  const prev = new Array<number>(n + 1);
  const curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1),
      );
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return 1 - prev[n] / Math.max(m, n);
}
