/**
 * Plugin control plugin, browser half — occupies the composer's named
 * `conversation.input.plugins` seat with a trigger that opens a panel listing
 * every plugin grouped into all plugins and favorites. Enable/disable and
 * favorite writes ride the `pluginInventory` Remote, so the panel holds no
 * client-side state beyond its own view (open, group, query, optimistic rows).
 */
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ui-conversation SlotMap merge (the input.plugins seat).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { PluginControls, type PluginControlsInjected } from './PluginControls.tsx'
import { en, NS, zh, type PluginControlsLocaleKey } from './locales.ts'

export type { PluginControlsInjected, PluginControlsProps } from './PluginControls.tsx'
export type { PluginControlsLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The composer plugin-control panel's copy. */
    pluginControls: PluginControlsLocaleKey
  }
}

// Type bridge for standalone installs: the `conversation.input.plugins` seat is
// not declared by any released `ui-conversation`, so this merge lets the panel
// typecheck against published packages. Remove once a dsh release ships the
// seat (the upstream plugin-control feature) — the runtime slot still has to
// exist, so this is a type-only shim, never a substitute for the runtime seat.
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'conversation.input.plugins': { kind: 'single'; scope: 'session' }
  }
}

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'remote', 'remote.pluginInventory']

/**
 * Client plugin body: register the plugin-control trigger over the composer seat.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-plugin-controls: dictionaries')

  const injected = (_sessionId: SessionId): PluginControlsInjected => ({
    list: async () => {
      const result = await ctx.remote.pluginInventory.list()
      if (!result.ok) throw new Error(`pluginInventory.list failed: ${result.error.code}: ${result.error.message}`)
      return result.value
    },
    setEnabled: async (entryId, enabled) => {
      const result = await ctx.remote.pluginInventory.setEnabled({ entryId, enabled })
      if (!result.ok) throw new Error(`pluginInventory.setEnabled failed: ${result.error.code}: ${result.error.message}`)
    },
    setFavorite: async (moduleName, favorite) => {
      const result = await ctx.remote.pluginInventory.setFavorite({ moduleName, favorite })
      if (!result.ok) throw new Error(`pluginInventory.setFavorite failed: ${result.error.code}: ${result.error.message}`)
    },
  })

  ctx.slots.inject('conversation.input.plugins', () => ctx.slots.register({
    name: 'conversation.input.plugins',
    locale: NS,
    inject: injected,
  }, PluginControls))
}
