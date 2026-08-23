# @deepseek-ai/dsh-client-ui-plugin-controls

[English](README.md) | 中文

插件控制面板，一个基于 `@deepseek-ai/dsh-host-plugin-inventory` 远程服务的浏览器表面插件。浏览器半边占据会话声明的 `conversation.input.plugins` 单槽位（紧挨输入框工具行的权限控制右侧）；节点半边是空 apply（roster 行）。

触发按钮打开一个从输入框向上生长、保持在视口内的弹层面板（输入框位于屏幕底部，因此面板占据其上方空间，过高时在内部滚动）。面板列出每一个非 group 的 Loader entry，分为「插件」和用户标记的「常用插件」两组，并带按名字筛选。每行有启用/停用开关和「常用」标记按钮。两个写入都走 `pluginInventory` 远程服务：`setEnabled` 把一个按 id 定向的 `disabled` 补丁写进 profile 的用户 patch 层（`cordis.patch.yml`），由启动器的 `watchUserPatches` 热重载，因此切换无需重启即可生效且重启后仍保留；`setFavorite` 写入 `plugin-favorites` 设置命名空间。面板只持有视图状态（打开、分组、查询、乐观行）——没有任何客户端业务状态。

> **⚠️ 运行时要求。** `conversation.input.plugins` 席位与 `pluginInventory.setEnabled`/`setFavorite` 远程方法**不在任何已发布的 dsh 中**（截至 0.1.0-rc.8 与 0.1.1-rc.2）。本插件只能在包含该功能的 dsh 构建上运行——要么带它的源码构建，要么等待未来发布。在普通发布版 dsh 上安装会在加载时报错（席位未声明）。安装前请先确认上游 PR 状态。
>
> **完整改动集（运行时 + 本插件）在 fork 分支**
> [`feat/plugin-controls`](https://github.com/fishOfOUC/deepseek-harness/tree/feat/plugin-controls)
> 上（`fishOfOUC/deepseek-harness`，47 个文件：ui-conversation 席位、pluginInventory
> `setEnabled`/`setFavorite`、web-app roster 行、本包、测试、Agent Notes）。
> 有 deepseek-harness **源码 checkout** 的机器可以直接拉取应用：
>
> ```sh
> git remote add fork https://github.com/fishOfOUC/deepseek-harness.git
> git fetch fork feat/plugin-controls
> git checkout -b feat/plugin-controls fork/feat/plugin-controls   # 或: git merge fork/feat/plugin-controls
> pnpm install && npm run build
> node --import tsx/esm apps/cli/src/bin.ts web --port 3188 --no-open   # 从源码运行,勿用 npm 全局 dsh
> ```
>
> 上游拉取请求（deepseek-ai/deepseek-harness ← `fishOfOUC:feat/plugin-controls`）是未来发布时内置该功能的路径。

## 截图

![插件控制面板：每行含常用爱心标记与启用开关](demo.png)

## 安装

**在 `deepseek-harness` 仓库内**，本包是 `packages/bundle/web-app/cordis.patch.yml` 里的一行，因此 `web` 部署经应用构建后即获得该面板（一旦该功能合入上游），无需任何额外安装。

**通过 GitHub 独立安装**（本包自带 `lib/` 与自己的 `cordis.patch.yml`，安装后自动插入 roster 行，无需手动改 patch）：

```sh
dsh plugin --profile web add github:fishOfOUC/plugin-ui-controls
```

或把 `"@deepseek-ai/dsh-client-ui-plugin-controls": "github:fishOfOUC/plugin-ui-controls"` 加进 profile 的 `package.json` 依赖并执行 `pnpm install`。bundle patch 会自动把 `ui-plugin-controls` 行插入 profile 的组合。

**从源码构建**（可选——`lib/` 已提交，安装无需构建）：

```sh
pnpm install
pnpm build     # tsdown: lib/index.mjs + lib/invariant.mjs(节点半边), lib/client.js(浏览器半边)
```

peer 依赖使用可解析的版本范围；运行时由宿主提供（这是 `dsh.client` 插件——浏览器半边从 web 应用的模块注册表注入 `@deepseek-ai/dsh-client-runtime`、`@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/dsh-client-ui-conversation` 等）。`tsc --noEmit` 类型检查还需要未发布的席位/favorite/Remote 类型，因此在功能发布前不纳入 `pnpm check`。

## 模型体验

间接的——通过面板驱动的插件启用开关；每个被切换的插件决定什么内容到达模型。

#### KV Cache effect

切换一个贡献提示词段落的插件会改变组装后的前缀；只贡献工具的插件改变的是工具 schema 的 token 占用，而非前缀。

## 已知限制与暂缓事项

- **开关是 profile 级用户覆盖，不是沙箱边界** —— 停用插件把它从运行树中移除，但已经写入持久状态（文件、凭据）的插件会保留这些状态；重新启用会恢复其能力。
- **运行时效果依赖 patch 层监听器** —— 变更在监听器防抖窗口后才落地，并非与点击同步；面板用乐观渲染兜底。
- **启用是恢复组合默认值** —— 它移除用户的 `disabled: true` 补丁，而不是强制写 `disabled: false`，因此部署的平台开关始终有效。
- **设置的「插件列表」标签页没有常用控件** —— 常用标记和分组只存在于输入框旁的面板里。
