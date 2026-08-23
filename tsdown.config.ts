import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { transform } from 'lightningcss'
import { defineConfig } from 'tsdown'

const PLUGIN_ID = '@deepseek-ai/dsh-client-ui-plugin-controls'
const CSS_PREFIX = '\0dsh-css:'
const CSS_SUFFIX = '.mjs'

/** Compile a CSS Module into a class map and inject its CSS with the client bundle. */
function cssModulesInline() {
  return {
    name: 'dsh-css-modules-inline',
    resolveId(source: string, importer?: string) {
      if (!source.endsWith('.module.css') || importer === undefined) return null
      return `${CSS_PREFIX}${resolve(dirname(importer), source)}${CSS_SUFFIX}`
    },
    async load(this: { addWatchFile(id: string): void }, virtualId: string) {
      if (!virtualId.startsWith(CSS_PREFIX)) return null
      const fileId = virtualId.slice(CSS_PREFIX.length, -CSS_SUFFIX.length)
      this.addWatchFile(fileId)
      const source = await readFile(fileId)
      const { code, exports: cssExports } = transform({
        filename: fileId,
        code: source,
        cssModules: { pattern: 'dshPluginControls_[local]' },
        minify: true,
      })
      const classMap: Record<string, string> = {}
      const classes = Object.entries(cssExports ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
      for (const [local, value] of classes) classMap[local] = value.name
      const tagId = `${PLUGIN_ID}/${basename(fileId)}`
      return [
        `const css = ${JSON.stringify(code.toString())};`,
        `const tagId = ${JSON.stringify(tagId)};`,
        `if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {`,
        `  const tag = document.createElement('style');`,
        `  tag.dataset.plugin = ${JSON.stringify(PLUGIN_ID)};`,
        '  tag.dataset.pluginCss = tagId;',
        '  tag.textContent = css;',
        '  document.head.appendChild(tag);',
        '}',
        `export default ${JSON.stringify(classMap)};`,
      ].join('\n')
    },
  }
}

export default defineConfig([
  {
    clean: true,
    dts: false,
    entry: { index: 'src/index.ts', invariant: 'src/invariant.ts' },
    format: 'esm',
    outDir: 'lib',
    platform: 'node',
  },
  {
    clean: false,
    dts: false,
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    deps: {
      neverBundle: [
        '@deepseek-ai/cordis',
        '@deepseek-ai/dsh-client-ui-conversation/client',
        '@deepseek-ai/dsh-client-ui-primitives',
        '@deepseek-ai/dsh-client-ui-slots',
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
    },
    format: 'cjs',
    outputOptions: {
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {`,
      entryFileNames: '[name].js',
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
    platform: 'browser',
    plugins: [cssModulesInline()],
    sourcemap: true,
  },
])
