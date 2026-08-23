import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import type { PluginInventorySnapshot } from '@deepseek-ai/dsh-api-remotes/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import {
  IconCordisPluginOutline14, IconHeart16, IconSearchOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the ui-conversation SlotMap merge (the input.plugins seat and its {locked} owner share).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import css from './PluginControls.module.css'

/** Injected business face of the composer plugin-control seat. */
export interface PluginControlsInjected {
  /** Read the current Host inventory snapshot. */
  list: () => Promise<PluginInventorySnapshot>
  /** Enable or disable one plugin durably. */
  setEnabled: (entryId: EntryId, enabled: boolean) => Promise<void>
  /** Mark or unmark one plugin as a favorite. */
  setFavorite: (moduleName: string, favorite: boolean) => Promise<void>
}

/** Full plugin-control seat component props. */
export type PluginControlsProps =
  PropsRuntime<'conversation.input.plugins'>
  & PropsLocale<'pluginControls'>
  & InjectFace<PluginControlsInjected>

type Entry = PluginInventorySnapshot['entries'][number]
type EntryId = Entry['entryId']
type GroupKey = 'all' | 'favorites'

/** Fixed panel width in px; the right-edge clamp below needs it before layout. */
const PANEL_WIDTH = 320
/** Distance between the panel's bottom edge and the trigger's top edge. */
const GAP = 8
/** Viewport clearance on every side (mirrors the Menu portal margin). */
const MARGIN = 12
/** Design cap on the panel height, as a fraction of the viewport. */
const MAX_HEIGHT_VH = 0.6
/**
 * Floor for the height clamp: a viewport with less room than this above the
 * composer gets an overlapping panel rather than an unusable sliver.
 */
const MIN_HEIGHT = 160

interface PanelPosition {
  bottom: number
  right: number
  maxHeight: number
}

/** Compact a module specifier without guessing whether its Loader id was generated. */
function moduleShortName(moduleName: string): string {
  const unscoped = moduleName.startsWith('@') ? moduleName.slice(moduleName.indexOf('/') + 1) : moduleName
  return unscoped
    .replace(/^cordis:/, '')
    .replace(/^cordis-plugin-/, '')
    .replace(/^dsh-(?:host-|client-)?/, '')
}

/** Whether one inventory row matches the local query. */
function matches(entry: Entry, normalizedQuery: string): boolean {
  if (normalizedQuery.length === 0) return true
  return [entry.moduleName, moduleShortName(entry.moduleName)]
    .some(value => value.toLocaleLowerCase().includes(normalizedQuery))
}

/** Replace one entry in place, preserving order. */
function patchEntry(entries: readonly Entry[], entryId: string, patch: Partial<Entry>): readonly Entry[] {
  return entries.map(entry => entry.entryId === entryId ? { ...entry, ...patch } : entry)
}

/** Replace one entry's favorite flag by module name, preserving order. */
function patchFavorite(entries: readonly Entry[], moduleName: string, favorite: boolean): readonly Entry[] {
  return entries.map(entry => entry.moduleName === moduleName ? { ...entry, favorite } : entry)
}

/**
 * Composer plugin-control trigger and panel: one button beside the access-mode
 * control opens a portal panel anchored above the trigger (the composer sits
 * at the viewport bottom, so the panel owns the space upward, viewport-bounded
 * with an internally scrolling list). It lists every plugin, grouped into all
 * plugins and favorites, with a name filter, an enable/disable switch, and a
 * favorite mark per row. Toggles update locally and write through the Host
 * Remote.
 */
export function PluginControls({ list, setEnabled, setFavorite, locked, t }: PluginControlsProps): ReactNode {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState<GroupKey>('all')
  const [query, setQuery] = useState('')
  const [snapshot, setSnapshot] = useState<PluginInventorySnapshot | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [request, setRequest] = useState(0)
  const [position, setPosition] = useState<PanelPosition | null>(null)

  // Load the inventory whenever the panel opens or a retry is requested.
  useEffect(() => {
    if (!open) return
    let current = true
    setStatus('loading')
    void Promise.resolve().then(list).then(
      (value) => { if (current) { setSnapshot(value); setStatus('idle') } },
      () => { if (current) setStatus('error') },
    )
    return () => { current = false }
  }, [open, list, request])

  // Anchor the panel's bottom edge above the trigger: the composer sits at the
  // viewport bottom, so a downward panel would open off-screen. Bottom-edge
  // anchoring also means later height changes (inventory load, filter results)
  // grow the panel upward without repositioning; only the top edge can collide
  // with the viewport, which the maxHeight clamp answers with internal scroll.
  useLayoutEffect(() => {
    if (!open) { setPosition(null); return }
    const update = (): void => {
      const rect = triggerRef.current?.getBoundingClientRect()
      /* v8 ignore next -- the ref is attached before this layout effect runs and the listeners die with it. */
      if (rect === undefined) return
      setPosition({
        bottom: window.innerHeight - rect.top + GAP,
        right: Math.min(Math.max(MARGIN, window.innerWidth - rect.right), window.innerWidth - PANEL_WIDTH - MARGIN),
        maxHeight: Math.max(Math.min(window.innerHeight * MAX_HEIGHT_VH, rect.top - GAP - MARGIN), MIN_HEIGHT),
      })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  // Outside pointerdown and Escape close the panel; the trigger and the
  // portaled panel are both inside, so clicks on either keep it open.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target as Node | null
      if (triggerRef.current?.contains(target) === true) return
      if (panelRef.current?.contains(target) === true) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // A locked composer offers nothing to control; close like the access-mode
  // control beside it does.
  useEffect(() => {
    if (locked) setOpen(false)
  }, [locked])

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filtered = useMemo(() => {
    if (snapshot === null) return []
    const scoped = group === 'favorites' ? snapshot.entries.filter(entry => entry.favorite) : snapshot.entries
    return scoped.filter(entry => matches(entry, normalizedQuery))
  }, [snapshot, group, normalizedQuery])

  /** Apply one entries transform to the loaded snapshot. */
  const applyEntries = (transform: (entries: readonly Entry[]) => readonly Entry[]): void => {
    setSnapshot((prev) => {
      /* v8 ignore next -- rows render only from a loaded snapshot; the null arm
         keeps the updater total while a (re)load is in flight. */
      if (prev === null) return prev
      return { entries: transform(prev.entries) }
    })
  }

  const toggleEnabled = (entry: Entry): void => {
    const next = !entry.enabled
    applyEntries(entries => patchEntry(entries, entry.entryId, { enabled: next }))
    void setEnabled(entry.entryId, next).catch(() => {
      applyEntries(entries => patchEntry(entries, entry.entryId, { enabled: entry.enabled }))
    })
  }

  const toggleFavorite = (entry: Entry): void => {
    const next = !entry.favorite
    applyEntries(entries => patchFavorite(entries, entry.moduleName, next))
    void setFavorite(entry.moduleName, next).catch(() => {
      applyEntries(entries => patchFavorite(entries, entry.moduleName, entry.favorite))
    })
  }

  const retry = (): void => {
    setRequest(value => value + 1)
  }

  const panelId = useId()
  const panel: ReactNode = open && position !== null ? createPortal(
    <div
      ref={panelRef}
      className={css.panel}
      id={panelId}
      role="dialog"
      aria-label={t('panel.title')}
      style={{ bottom: position.bottom, right: position.right, maxHeight: position.maxHeight }}
    >
      <div className={css.tabs} role="tablist" aria-label={t('panel.title')}>
        {([['all', t('group.all')], ['favorites', t('group.favorites')]] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={group === key}
            className={clsx(css.tab, group === key && css.tabActive)}
            onClick={() => { setGroup(key) }}
          >
            {label}
          </button>
        ))}
      </div>
      <label className={css.search}>
        <IconSearchOutline16 aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder={t('panel.search')}
          aria-label={t('panel.search')}
          onChange={(event) => { setQuery(event.currentTarget.value) }}
        />
      </label>
      <div className={css.list} aria-busy={status === 'loading'}>
        {status === 'loading' ? <p className={css.status}>{t('loading')}</p> : null}
        {status === 'error' ? (
          <div className={css.failure}>
            <p role="alert">{t('error')}</p>
            <button type="button" onClick={retry}>{t('retry')}</button>
          </div>
        ) : null}
        {status === 'idle' && filtered.length === 0 ? (
          <p className={css.status}>
            {group === 'favorites'
              ? (normalizedQuery.length === 0 ? t('empty.favorites') : t('empty.search'))
              : (snapshot !== null && snapshot.entries.length === 0 ? t('empty') : t('empty.search'))}
          </p>
        ) : null}
        {status === 'idle' && filtered.length > 0 ? (
          <ul className={css.rows}>
            {filtered.map(entry => (
              <li key={entry.entryId} className={css.row}>
                <span className={css.name} title={entry.moduleName}>{moduleShortName(entry.moduleName)}</span>
                <button
                  type="button"
                  className={clsx(css.favorite, entry.favorite && css.favoriteActive)}
                  aria-pressed={entry.favorite}
                  aria-label={entry.favorite ? t('row.unfavorite') : t('row.favorite')}
                  onClick={() => { toggleFavorite(entry) }}
                >
                  <IconHeart16 size={14} />
                </button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={entry.enabled}
                  aria-label={entry.enabled ? t('row.disable') : t('row.enable')}
                  className={clsx(css.switch, entry.enabled && css.switchOn)}
                  onClick={() => { toggleEnabled(entry) }}
                >
                  <span className={css.thumb} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>,
    document.body,
  ) : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={css.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={t('trigger.aria')}
        disabled={locked}
        onClick={() => { setOpen(value => !value) }}
      >
        <IconCordisPluginOutline14 size={14} />
        <span className={css.triggerLabel}>{t('trigger')}</span>
      </button>
      {panel}
    </>
  )
}
