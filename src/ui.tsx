import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { uid } from './lib/id';

// ── Buttons ────────────────────────────────────────────────────────────────
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  loading?: boolean;
  block?: boolean;
};

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  block = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    variant === 'primary' && 'btn-primary',
    variant === 'ghost' && 'btn-ghost',
    variant === 'danger' && 'btn-danger',
    size === 'sm' && 'btn-sm',
    block && 'btn-block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}

// ── Karten & Struktur ──────────────────────────────────────────────────────
export function Card({
  children,
  className = '',
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {hint && <span className="small muted">{hint}</span>}
      <span className="spacer" />
      {action}
    </div>
  );
}

export function Empty({
  icon = '·',
  title,
  hint,
  action,
}: {
  icon?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div style={{ color: 'var(--ink)', fontWeight: 550 }}>{title}</div>
      {hint && (
        <p className="small" style={{ maxWidth: 380, margin: '6px auto 0' }}>
          {hint}
        </p>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="bar">
      <div className="bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="tiny muted">{hint}</span>}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'modal-wide' : ''} fade-in`} role="dialog" aria-modal="true">
        <div className="row" style={{ marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 20 }}>{title}</h2>
          <span className="spacer" />
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Schließen">
            ✕
          </Button>
        </div>
        <div className="stack">{children}</div>
        {footer && (
          <div className="row" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Toasts ─────────────────────────────────────────────────────────────────
interface Toast {
  id: string;
  message: string;
  kind: 'info' | 'error';
}

const ToastContext = createContext<{
  notify: (message: string, kind?: 'info' | 'error') => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, kind: 'info' | 'error' = 'info') => {
    const toast: Toast = { id: uid('t'), message, kind };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, kind === 'error' ? 6000 : 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="toast fade-in" data-kind={t.kind}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast benötigt ToastProvider');
  return ctx.notify;
}

/** Kapselt Laden + Fehlermeldung für LLM-Aufrufe. */
export function useAsyncAction() {
  const notify = useToast();
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async <T,>(fn: () => Promise<T>, opts?: { success?: string }): Promise<T | null> => {
      setBusy(true);
      try {
        const result = await fn();
        if (opts?.success) notify(opts.success);
        return result;
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Unbekannter Fehler', 'error');
        return null;
      } finally {
        setBusy(false);
      }
    },
    [notify],
  );

  return { busy, run };
}
