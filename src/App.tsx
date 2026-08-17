import { useEffect, useMemo, useState } from 'react';
import { StoreProvider, useLanguage, useStore } from './store';
import { ToastProvider } from './ui';
import type { View } from './types-view';
import { Overview } from './screens/Overview';
import { Dashboard } from './screens/Dashboard';
import { Review } from './screens/Review';
import { Exercises } from './screens/Exercises';
import { Grammar } from './screens/Grammar';
import { Reader } from './screens/Reader';
import { Conversation } from './screens/Conversation';
import { Writing } from './screens/Writing';
import { Vocab } from './screens/Vocab';
import { Daily } from './screens/Daily';
import { Assessment } from './screens/Assessment';
import { Settings } from './screens/Settings';
import { getPhase } from './lib/phase';
import { dueCards } from './lib/sm2';
import { todayISO } from './lib/date';

interface TabDef {
  id: View;
  label: string;
  /** Ab welcher Phase das Modul offen ist. */
  phase: 1 | 2 | 3;
}

const TABS: TabDef[] = [
  { id: 'dashboard', label: 'Dashboard', phase: 1 },
  { id: 'vocab', label: 'Vokabeln', phase: 1 },
  { id: 'exercises', label: 'Übungen', phase: 1 },
  { id: 'grammar', label: 'Grammatik', phase: 1 },
  { id: 'reader', label: 'Reader', phase: 2 },
  { id: 'chat', label: 'Konversation', phase: 3 },
  { id: 'writing', label: 'Schreiben', phase: 3 },
  { id: 'daily', label: 'Alltag', phase: 3 },
];

function Workspace() {
  const { state, setActive } = useStore();
  const lang = useLanguage();
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    setView('dashboard');
  }, [lang?.id]);

  const phase = useMemo(() => (lang ? getPhase(lang) : null), [lang]);
  const due = useMemo(
    () => (lang ? dueCards(state.cards, lang.id, todayISO()).length : 0),
    [state.cards, lang],
  );

  if (!lang) return <Overview />;

  const currentPhase = phase?.phase ?? 1;
  const locked = (tab: TabDef) => tab.phase > currentPhase;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button className="brand" onClick={() => setActive(null)} title="Sprache wechseln">
            <span className="brand-dot" />
            Lingua
          </button>
          <span className="muted">/</span>
          <button
            className="row"
            style={{ background: 'none', border: 0, cursor: 'pointer', gap: 7, padding: 0 }}
            onClick={() => setActive(null)}
          >
            <span>{lang.emoji}</span>
            <span style={{ fontWeight: 550 }}>{lang.name}</span>
            <span className="tiny muted">Tag {phase?.day}</span>
          </button>
          <span className="spacer" />
          <button
            className={`tab ${view === 'settings' ? '' : ''}`}
            data-active={view === 'settings'}
            onClick={() => setView('settings')}
            style={{ borderBottom: 0 }}
            title="Einstellungen"
          >
            ⚙
          </button>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-inner">
          {TABS.map((tab) => {
            const isLocked = locked(tab);
            return (
              <button
                key={tab.id}
                className="tab"
                data-active={view === tab.id}
                disabled={isLocked}
                onClick={() => setView(tab.id)}
                title={
                  isLocked
                    ? `Wird in Phase ${tab.phase} freigeschaltet`
                    : undefined
                }
              >
                {tab.label}
                {tab.id === 'vocab' && due > 0 && <span className="tab-badge">{due}</span>}
                {isLocked && <span className="tab-lock">🔒</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="main">
        {view === 'dashboard' && <Dashboard lang={lang} go={setView} />}
        {/* Das Review ist kein eigener Reiter mehr – es gehört zu den Vokabeln
            und wird von dort und vom Dashboard aus gestartet. */}
        {view === 'review' && <Review lang={lang} go={setView} />}
        {view === 'exercises' && <Exercises lang={lang} go={setView} />}
        {view === 'grammar' && <Grammar lang={lang} />}
        {view === 'vocab' && <Vocab lang={lang} go={setView} />}
        {view === 'reader' && <Reader lang={lang} />}
        {view === 'chat' && <Conversation lang={lang} />}
        {view === 'writing' && <Writing lang={lang} />}
        {view === 'daily' && <Daily lang={lang} />}
        {view === 'assessment' && <Assessment lang={lang} go={setView} />}
        {view === 'settings' && <Settings lang={lang} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Workspace />
      </ToastProvider>
    </StoreProvider>
  );
}
