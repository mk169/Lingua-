import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Fängt Fehler beim Rendern ab und zeigt sie an, statt die Seite leer zu lassen.
 *
 * Bewusst ohne Import aus Store oder UI-Bibliothek: Wenn die App abstürzt, ist
 * die häufigste Ursache genau dort. Ein Notfallbildschirm, der dieselben Module
 * braucht wie das Kaputte, ist keiner. Deshalb eigenes Markup und eigene Farben.
 *
 * Syntaxfehler im Bundle fängt das hier nicht – dafür sitzt in `index.html` ein
 * klassischer `window.onerror`-Handler vor dem Modul-Script.
 */
interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  info: string;
}

const STORAGE_KEY = 'lingua.state.v1';

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: '' };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Auch in der Konsole lassen – für den Fall, dass jemand ein Gerät angeschlossen hat.
    console.error('Lingua ist abgestürzt', error, info.componentStack);
    this.setState({ info: info.componentStack ?? '' });
  }

  private reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Privater Modus oder gesperrter Speicher: dann gibt es nichts zu löschen.
    }
    location.reload();
  };

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="crash">
        <h1>Lingua ist abgestürzt</h1>
        <p>
          Etwas in der App hat einen Fehler ausgelöst. Dein Lernstand ist gespeichert – ein
          Neuladen genügt meistens.
        </p>
        <div className="crash-actions">
          <button onClick={() => location.reload()}>Neu laden</button>
          <button onClick={this.reset}>Daten zurücksetzen</button>
        </div>
        <p className="crash-note">
          „Daten zurücksetzen“ löscht Deck, Fortschritt und Einstellungen in diesem Browser.
          Nur nehmen, wenn das Neuladen nichts bringt.
        </p>
        <details>
          <summary>Fehlerdetails</summary>
          <pre>
            {String(error.stack || error.message)}
            {info ? `\n\nKomponenten:${info}` : ''}
            {`\n\n${navigator.userAgent}`}
          </pre>
        </details>
      </div>
    );
  }
}
