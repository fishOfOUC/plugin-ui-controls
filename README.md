# @deepseek-ai/dsh-client-ui-plugin-controls

English | [中文](README.zh.md)

Plugin control panel, a browser surface plugin over the [`@deepseek-ai/dsh-host-plugin-inventory`](../../host/plugin-inventory/README.md) Remote. The browser half occupies the conversation-declared `conversation.input.plugins` single seat (immediately right of the access-mode control in the composer tool row); the node half is an empty apply (the roster row).

The trigger opens a portal panel that grows upward from the composer and stays inside the viewport (the composer sits at the bottom of the screen, so the panel owns the space above it and scrolls internally when tall). It lists every non-group Loader entry, grouped into all plugins and a user-marked favorites subset, with a name filter. Each row carries an enable/disable switch and a favorite mark button. Both writes ride the `pluginInventory` Remote: `setEnabled` writes an id-targeted `disabled` patch into the profile's user patch layer (`cordis.patch.yml`), which the launcher's `watchUserPatches` hot-reloads so the toggle takes effect without a restart and survives one; `setFavorite` writes the `plugin-favorites` Settings namespace. The panel holds only view state (open, group, query, optimistic rows) — no client-side business state.

## Screenshot

![Plugin control panel with a favorite heart mark and an enable switch per row](demo.png)

## Installation

In the `deepseek-harness` repository this package is already a row of `packages/bundle/web-app/cordis.patch.yml`, so a `web` deployment gets the panel from the app build with nothing else to do.

To install this package standalone into a self-managed profile, add the row through the profile's user patch layer — never the profile root `cordis.yml`, which the launcher rewrites to an empty list on every boot:

1. Make the package resolvable by the profile's Loader:

   ```sh
   dsh plugin --profile web add ~/code/plugin-ui-controls
   ```

   The `declares no dsh.bundle` warning is expected: this is a client UI plugin (`dsh.client`, not a patch-layer bundle), so it installs as a plain dependency and you add the row yourself in the next step.

2. Insert the row into `~/.dsh/profiles/web/cordis.patch.yml` with an `insert` list — a bare `- id:` line is an id-targeted override, not a new row:

   ```yml
   - insert:
       - id: ui-plugin-controls
         name: '@deepseek-ai/dsh-client-ui-plugin-controls'
   ```

3. Restart `dsh web` and refresh the browser.

A stock `web` profile already composes the row's dependencies — `@deepseek-ai/dsh-client-ui-conversation` (declares the `conversation.input.plugins` seat), `@deepseek-ai/dsh-api-remotes`, `@deepseek-ai/dsh-host-plugin-inventory` (the `list`/`setEnabled`/`setFavorite` Remotes), and `@deepseek-ai/dsh-client-locale` — so only the one `insert` is needed. A minimal or custom composition must provide those too.

> The package's `peerDependencies` use the in-repository `workspace:^` protocol; they are type-only for this client half. For a standalone npm publish, re-scope them to resolvable version ranges first.

## Model Experience

Indirectly, through the plugin-enablement toggles the panel drives; each toggled plugin owns what reaches the model.

#### KV Cache effect

Toggling a plugin that contributes a prompt section changes the assembled prefix; a plugin that contributes only tools changes the tool-schema token budget, not the prefix.

## Known Limitations and Deferred Work

- **The toggle is a per-profile user override, not a sandbox boundary** — disabling a plugin removes it from the running tree, but a plugin already granted durable state (files, credentials) keeps that state; re-enabling restores its capability.
- **The runtime effect rides the patch-layer watcher** — the change lands after the watcher's write-settle window, not synchronously with the click; the panel renders optimistically.
- **Enable restores the composition default** — it removes the user's `disabled: true` patch rather than forcing `disabled: false`, so a deployment's platform gate stays authoritative.
- **No favorite control in the Settings "plugin list" tab** — the favorite mark and grouping live only in the composer panel.
