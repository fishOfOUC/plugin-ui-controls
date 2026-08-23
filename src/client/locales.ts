/** Copy dictionaries for the composer plugin-control panel. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'pluginControls'

/** Simplified Chinese dictionary and key source of truth. */
export const zh = {
  trigger: '插件',
  'trigger.aria': '打开插件控制面板',
  'panel.title': '插件',
  'panel.search': '搜索插件',
  loading: '正在读取插件…',
  'group.all': '插件',
  'group.favorites': '常用插件',
  'row.favorite': '标记为常用',
  'row.unfavorite': '取消常用标记',
  'row.enable': '启用插件',
  'row.disable': '停用插件',
  empty: '暂无插件。',
  'empty.search': '没有匹配的插件。',
  'empty.favorites': '还没有标记常用的插件。',
  error: '暂时无法读取插件。',
  retry: '重试',
} satisfies Record<string, string>

/** Plugin-control locale key union. */
export type PluginControlsLocaleKey = keyof typeof zh

/** English dictionary checked against the Chinese key set. */
export const en = {
  trigger: 'Plugins',
  'trigger.aria': 'Open the plugin control panel',
  'panel.title': 'Plugins',
  'panel.search': 'Search plugins',
  loading: 'Reading plugins…',
  'group.all': 'Plugins',
  'group.favorites': 'Favorites',
  'row.favorite': 'Mark as favorite',
  'row.unfavorite': 'Remove favorite mark',
  'row.enable': 'Enable plugin',
  'row.disable': 'Disable plugin',
  empty: 'No plugins are available.',
  'empty.search': 'No matching plugins.',
  'empty.favorites': 'No favorite plugins yet.',
  error: 'Plugins are temporarily unavailable.',
  retry: 'Retry',
} satisfies Record<PluginControlsLocaleKey, string>
