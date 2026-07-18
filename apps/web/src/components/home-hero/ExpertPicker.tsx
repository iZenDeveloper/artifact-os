// Composer-footer Expert picker — persona/methodology lens orthogonal to
// Template (workflow) and Design (brand). Default is None (general OD).
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { useT } from '../../i18n';

export interface ExpertCatalogEntry {
  id: string;
  title: string;
  summary: string;
  vertical?: string | null;
  tags?: string[];
}

interface Props {
  experts: ExpertCatalogEntry[];
  selectedExpertId: string | null;
  disabled?: boolean;
  loading?: boolean;
  onChange: (expertId: string | null) => void;
}

export function ExpertPicker({
  experts,
  selectedExpertId,
  disabled = false,
  loading = false,
  onChange,
}: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const active = useMemo(
    () => experts.find((expert) => expert.id === selectedExpertId) ?? null,
    [experts, selectedExpertId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return experts;
    return experts.filter((expert) =>
      `${expert.title} ${expert.summary} ${(expert.tags ?? []).join(' ')}`
        .toLowerCase()
        .includes(q),
    );
  }, [query, experts]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointer(event: MouseEvent) {
      if (wrapRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const hasSelection = Boolean(active);
  const valueLabel = active ? active.title : t('homeHero.expertPicker.none');

  return (
    <div
      ref={wrapRef}
      className={`home-hero__footer-option home-hero__footer-option--select home-hero__expert-option${open ? ' is-open' : ''}${hasSelection ? ' has-selection' : ''}`}
      data-field-name="expert"
      data-testid="home-hero-expert-picker"
    >
      <button
        type="button"
        className="home-hero__footer-select-trigger home-hero__expert-trigger"
        data-testid="home-hero-expert-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled || loading}
        title={t('homeHero.expertPicker.label')}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="home-hero__expert-kicker" aria-hidden>
          {t('homeHero.expertPicker.label')}
        </span>
        <span className="home-hero__footer-select-label">{valueLabel}</span>
        <Icon name="chevron-down" size={12} />
      </button>
      {hasSelection ? (
        <button
          type="button"
          className="home-hero__template-reset"
          data-testid="home-hero-expert-clear"
          aria-label={t('homeHero.expertPicker.clear')}
          onClick={(event) => {
            event.stopPropagation();
            onChange(null);
            setOpen(false);
          }}
        >
          <Icon name="close" size={11} strokeWidth={2.2} />
        </button>
      ) : null}
      {open ? (
        <div
          className="home-hero__footer-select-menu home-hero__expert-menu"
          role="listbox"
          data-testid="home-hero-expert-menu"
        >
          <div className="home-hero__footer-select-search">
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder={t('homeHero.expertPicker.searchPlaceholder')}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t('homeHero.expertPicker.searchPlaceholder')}
            />
          </div>
          <button
            type="button"
            role="option"
            aria-selected={!hasSelection}
            className={`home-hero__footer-select-item${hasSelection ? '' : ' is-selected'}`}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            <span className="home-hero__footer-select-copy">
              <span className="home-hero__footer-select-label">
                {t('homeHero.expertPicker.none')}
              </span>
              <span className="home-hero__footer-select-description">
                {t('homeHero.expertPicker.noneSummary')}
              </span>
            </span>
          </button>
          {filtered.length === 0 ? (
            <div className="home-hero__footer-select-empty">
              {t('homeHero.footer.noMatches')}
            </div>
          ) : (
            filtered.map((expert) => {
              const selected = expert.id === selectedExpertId;
              return (
                <button
                  key={expert.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`home-hero__footer-select-item${selected ? ' is-selected' : ''}`}
                  data-testid={`home-hero-expert-option-${expert.id}`}
                  onClick={() => {
                    onChange(expert.id);
                    setOpen(false);
                  }}
                >
                  <span className="home-hero__footer-select-copy">
                    <span className="home-hero__footer-select-label">{expert.title}</span>
                    {expert.summary ? (
                      <span className="home-hero__footer-select-description">
                        {expert.summary}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
