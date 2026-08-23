// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PluginControls } from '../src/client/PluginControls.tsx'
import type {
  PluginControlsInjected, PluginControlsProps,
} from '../src/client/PluginControls.tsx'
// Type-only: pulls the package's LocaleNamespaceMap merge (`pluginControls`)
// into this aggregate test program, so PropsLocale resolves the `t` seat.
import type {} from '../src/client/index.ts'
import { en, type PluginControlsLocaleKey } from '../src/client/locales.ts'

afterEach(cleanup)

type Snapshot = Awaited<ReturnType<PluginControlsInjected['list']>>

const t = ((key: PluginControlsLocaleKey): string => en[key]) as PluginControlsProps['t']

const SNAPSHOT = {
  entries: [
    { entryId: 'one', moduleName: '@deepseek-ai/dsh-host-bash', enabled: true, favorite: false, fiberPhase: 'active' },
    { entryId: 'two', moduleName: '@deepseek-ai/dsh-web-fetch', enabled: true, favorite: true, fiberPhase: 'active' },
    { entryId: 'three', moduleName: 'my-local-plugin', enabled: false, favorite: false, fiberPhase: null },
  ],
} as unknown as Snapshot

function props(overrides: Partial<PluginControlsInjected> & { locked?: boolean } = {}): PluginControlsProps {
  return {
    locked: false,
    t,
    list: async () => SNAPSHOT,
    setEnabled: vi.fn<PluginControlsInjected['setEnabled']>().mockResolvedValue(undefined),
    setFavorite: vi.fn<PluginControlsInjected['setFavorite']>().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as PluginControlsProps
}

describe('PluginControls', () => {
  it('opens a panel listing every plugin with an enable switch and a favorite button', async () => {
    const p = props()
    render(<PluginControls {...p} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))

    const dialog = await screen.findByRole('dialog', { name: en['panel.title'] })
    expect(dialog).toBeTruthy()
    // Three plugin rows, each with a switch and a favorite button.
    expect(screen.getAllByRole('switch')).toHaveLength(3)
    expect(screen.getAllByRole('button', { name: en['row.favorite'] })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: en['row.unfavorite'] })).toHaveLength(1)
  })

  it('filters rows by name', async () => {
    render(<PluginControls {...props()} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    const search = await screen.findByRole('searchbox', { name: en['panel.search'] })

    fireEvent.change(search, { target: { value: 'web-fetch' } })
    expect(screen.getAllByRole('switch')).toHaveLength(1)
    expect(screen.getByText('web-fetch')).toBeTruthy()

    fireEvent.change(search, { target: { value: 'no-such-plugin' } })
    expect(screen.queryAllByRole('switch')).toHaveLength(0)
    expect(screen.getByText(en['empty.search'])).toBeTruthy()
  })

  it('groups into favorites on the favorites tab', async () => {
    render(<PluginControls {...props()} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    await screen.findByRole('dialog', { name: en['panel.title'] })

    fireEvent.click(screen.getByRole('tab', { name: en['group.favorites'] }))
    expect(screen.getAllByRole('switch')).toHaveLength(1)
    expect(screen.getByText('web-fetch')).toBeTruthy()
  })

  it('marks a plugin favorite and disables one through the Remote', async () => {
    const p = props()
    render(<PluginControls {...p} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    await screen.findByRole('dialog', { name: en['panel.title'] })

    fireEvent.click(screen.getAllByRole('button', { name: en['row.favorite'] })[0]!)
    await waitFor(() => { expect(p.setFavorite).toHaveBeenCalledWith('@deepseek-ai/dsh-host-bash', true) })

    const switches = screen.getAllByRole('switch')
    fireEvent.click(switches[2]!)
    await waitFor(() => { expect(p.setEnabled).toHaveBeenCalledWith('three', true) })
  })

  it('closes the panel on Escape', async () => {
    render(<PluginControls {...props()} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    await screen.findByRole('dialog', { name: en['panel.title'] })

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => { expect(screen.queryByRole('dialog')).toBeNull() })
  })

  it('anchors the panel above the trigger with a viewport-bounded max height', async () => {
    render(<PluginControls {...props()} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))

    const dialog = await screen.findByRole('dialog', { name: en['panel.title'] })
    // jsdom reports a zero rect for the trigger: the bottom anchor falls past
    // the viewport bottom edge and the height clamp hits its floor. What the
    // test pins is the anchoring scheme — `bottom` (grows upward from the
    // composer), never `top` (grows downward off the viewport bottom).
    expect(dialog.style.top).toBe('')
    expect(dialog.style.bottom).not.toBe('')
    expect(dialog.style.maxHeight).toBe('160px')
  })

  it('closes on an outside pointerdown but not from the trigger, the panel, or a stray key', async () => {
    render(<PluginControls {...props()} />)
    const trigger = screen.getByRole('button', { name: en['trigger.aria'] })
    fireEvent.click(trigger)
    await screen.findByRole('dialog', { name: en['panel.title'] })

    fireEvent.pointerDown(trigger)
    fireEvent.keyDown(document, { key: 'a' })
    fireEvent.pointerDown(screen.getByRole('searchbox', { name: en['panel.search'] }))
    expect(screen.queryByRole('dialog')).not.toBeNull()

    fireEvent.pointerDown(document.body)
    await waitFor(() => { expect(screen.queryByRole('dialog')).toBeNull() })
  })

  it('closes when the composer locks', async () => {
    const { rerender } = render(<PluginControls {...props()} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    await screen.findByRole('dialog', { name: en['panel.title'] })

    rerender(<PluginControls {...props({ locked: true })} />)
    await waitFor(() => { expect(screen.queryByRole('dialog')).toBeNull() })
  })

  it('reverts an enable toggle when the Remote rejects', async () => {
    const setEnabled = vi.fn<PluginControlsInjected['setEnabled']>().mockRejectedValue(new Error('private transport detail'))
    render(<PluginControls {...props({ setEnabled })} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    await screen.findByRole('dialog', { name: en['panel.title'] })

    const disabledRow = screen.getAllByRole('switch')[2]!
    expect(disabledRow.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(disabledRow)
    expect(disabledRow.getAttribute('aria-checked')).toBe('true') // optimistic
    await waitFor(() => { expect(disabledRow.getAttribute('aria-checked')).toBe('false') })
  })

  it('reverts a favorite mark when the Remote rejects', async () => {
    const setFavorite = vi.fn<PluginControlsInjected['setFavorite']>().mockRejectedValue(new Error('private transport detail'))
    render(<PluginControls {...props({ setFavorite })} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    await screen.findByRole('dialog', { name: en['panel.title'] })

    const mark = screen.getAllByRole('button', { name: en['row.favorite'] })[0]!
    fireEvent.click(mark)
    expect(mark.getAttribute('aria-pressed')).toBe('true') // optimistic
    await waitFor(() => { expect(mark.getAttribute('aria-pressed')).toBe('false') })
  })

  it('reports an empty favorites tab, with and without a query', async () => {
    const list = async () => ({ entries: [SNAPSHOT.entries[0]!] }) as unknown as Snapshot // no favorites
    render(<PluginControls {...props({ list })} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))
    await screen.findByRole('dialog', { name: en['panel.title'] })

    fireEvent.click(screen.getByRole('tab', { name: en['group.favorites'] }))
    expect(screen.getByText(en['empty.favorites'])).toBeTruthy()

    fireEvent.change(screen.getByRole('searchbox', { name: en['panel.search'] }), { target: { value: 'no-such-plugin' } })
    expect(screen.getByText(en['empty.search'])).toBeTruthy()
  })

  it('drops loads that settle after the panel closes', async () => {
    const deferreds: Array<{ resolve: (v: Snapshot) => void; reject: (e: Error) => void }> = []
    const list = vi.fn<PluginControlsInjected['list']>().mockImplementation(() =>
      new Promise<Snapshot>((resolve, reject) => { deferreds.push({ resolve, reject }) }))
    render(<PluginControls {...props({ list })} />)
    const trigger = screen.getByRole('button', { name: en['trigger.aria'] })

    fireEvent.click(trigger)
    await waitFor(() => { expect(deferreds).toHaveLength(1) }) // list runs one microtask after open
    fireEvent.keyDown(document, { key: 'Escape' })
    deferreds[0]!.resolve({ entries: [] }) // late success must not repopulate anything

    fireEvent.click(trigger)
    await waitFor(() => { expect(deferreds).toHaveLength(2) })
    fireEvent.keyDown(document, { key: 'Escape' })
    deferreds[1]!.reject(new Error('late failure')) // late failure must not surface an alert

    await waitFor(() => { expect(list).toHaveBeenCalledTimes(2) })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('shows a failure and retries into the empty state', async () => {
    const list = vi.fn<PluginControlsInjected['list']>()
      .mockRejectedValueOnce(new Error('private transport detail'))
      .mockResolvedValueOnce({ entries: [] })
    render(<PluginControls {...props({ list })} />)
    fireEvent.click(screen.getByRole('button', { name: en['trigger.aria'] }))

    expect((await screen.findByRole('alert')).textContent).toBe(en.error)
    fireEvent.click(screen.getByRole('button', { name: en.retry }))
    await waitFor(() => { expect(list).toHaveBeenCalledTimes(2) })
    expect(await screen.findByText(en.empty)).toBeTruthy()
  })
})
