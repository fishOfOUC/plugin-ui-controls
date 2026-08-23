/**
 * ui-plugin-controls plugin halves: the browser entry occupies the
 * conversation-declared `conversation.input.plugins` single seat with the
 * trigger/panel component, its injected face folds Remote results into values
 * or thrown failures, and fiber teardown empties the seat (HMR safety); the
 * inert node entry and the invariant companion's ownership reservation.
 */
import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it, vi } from 'vitest'
import InvariantRegistry from '@deepseek-ai/dsh-invariants'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { PluginControls } from '../src/client/PluginControls.tsx'
import type { PluginControlsInjected } from '../src/client/index.ts'
import { apply, inject } from '../src/client/index.ts'
import { NS } from '../src/client/locales.ts'
import { apply as nodeApply } from '../src/index.ts'
import * as ControlsInvariant from '../src/invariant.ts'

const SID = 's-plugins' as SessionId

const ENTRY_ID = 'one' as Parameters<PluginControlsInjected['setEnabled']>[0]
const MODULE_NAME: Parameters<PluginControlsInjected['setFavorite']>[0] = '@scope/pkg'

const REMOTE_FAILURE = { ok: false, error: { code: 'inventory-unavailable', message: 'gone' } }

async function bench() {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  const slots = ctx.get('slots') as SlotRegistry
  slots.register({
    name: 'root',
    children: { 'conversation.input.plugins': { kind: 'single', scope: 'session' } },
  } as never, () => null)
  const pluginInventory = {
    list: vi.fn(() => Promise.resolve({ ok: true, value: { entries: [] } })),
    setEnabled: vi.fn(() => Promise.resolve({ ok: true, value: undefined })),
    setFavorite: vi.fn(() => Promise.resolve({ ok: true, value: undefined })),
  }
  ctx.provide('remote', { pluginInventory })
  ctx.provide('remote.pluginInventory', pluginInventory)
  ctx.provide('locale', new LocaleRuntime(ctx))
  return { ctx, slots, pluginInventory }
}

describe('ui-plugin-controls browser apply', () => {
  it('declares every service it binds', () => {
    expect(inject).toEqual(['slots', 'locale', 'remote', 'remote.pluginInventory'])
  })

  it('node-half apply is an intentional no-op', () => {
    expect(() => { nodeApply() }).not.toThrow()
  })

  it('waits until conversation declares the plugins seat', async () => {
    const ctx = new Context()
    await ctx.plugin(SlotRegistry).await()
    ctx.provide('remote', { pluginInventory: {} })
    ctx.provide('remote.pluginInventory', {})
    ctx.provide('locale', new LocaleRuntime(ctx))
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(ctx.slots.entries('conversation.input.plugins')).toHaveLength(0)
    ctx.slots.register({
      name: 'root', children: { 'conversation.input.plugins': { kind: 'single', scope: 'session' } },
    } as never, () => null)
    await Promise.resolve()
    expect(ctx.slots.entries('conversation.input.plugins')).toHaveLength(1)
  })

  it('registers the panel, folds Remote results through the injected face, and unregisters on teardown', async () => {
    const b = await bench()
    const fiber = b.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    const entry = b.slots.entries('conversation.input.plugins')[0]!
    expect(entry.component).toBe(PluginControls)
    // The dictionary namespace is registered under this plugin's module name.
    expect(NS).toBe('pluginControls')
    const injected = (entry.inject as unknown as (id: SessionId) => PluginControlsInjected)(SID)

    await expect(injected.list()).resolves.toEqual({ entries: [] })
    await expect(injected.setEnabled(ENTRY_ID, false)).resolves.toBeUndefined()
    expect(b.pluginInventory.setEnabled).toHaveBeenCalledWith({ entryId: ENTRY_ID, enabled: false })
    await expect(injected.setFavorite(MODULE_NAME, true)).resolves.toBeUndefined()
    expect(b.pluginInventory.setFavorite).toHaveBeenCalledWith({ moduleName: MODULE_NAME, favorite: true })

    // Remote failures surface as thrown errors carrying code and message.
    b.pluginInventory.list.mockResolvedValueOnce(REMOTE_FAILURE as never)
    await expect(injected.list()).rejects.toThrow('pluginInventory.list failed: inventory-unavailable: gone')
    b.pluginInventory.setEnabled.mockResolvedValueOnce(REMOTE_FAILURE as never)
    await expect(injected.setEnabled(ENTRY_ID, false)).rejects.toThrow('pluginInventory.setEnabled failed: inventory-unavailable: gone')
    b.pluginInventory.setFavorite.mockResolvedValueOnce(REMOTE_FAILURE as never)
    await expect(injected.setFavorite(MODULE_NAME, true)).rejects.toThrow('pluginInventory.setFavorite failed: inventory-unavailable: gone')

    await fiber.dispose()
    expect(b.slots.entries('conversation.input.plugins')).toHaveLength(0)
  })
})

describe('ui-plugin-controls invariant companion', () => {
  it('reserves package ownership under its declared companion name', async () => {
    const ctx = new Context()
    await ctx.plugin(InvariantRegistry, { enabled: true })
    const fiber = ctx.plugin(ControlsInvariant)
    await fiber.await()
    expect(ControlsInvariant.name).toBe('client-ui-plugin-controls-invariant')
    expect(ControlsInvariant.inject).toEqual(['invariants'])
    // Emitting an unrelated event proves the companion installed no audit.
    expect(() => { (ctx.emit as (event: string) => void)('slots/changed') }).not.toThrow()
    await fiber.dispose()
  })
})
