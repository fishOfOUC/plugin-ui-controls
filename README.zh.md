# @deepseek-ai/dsh-client-ui-plugin-controls

[English](README.md) | 中文

插件控制面板，一个基于 [`@deepseek-ai/dsh-host-plugin-inventory`](../../host/plugin-inventory/README.zh.md) 远程服务的浏览器表面插件。浏览器半边占据会话声明的 `conversation.input.plugins` 单槽位（紧挨输入框工具行的权限控制右侧）；节点半边是空 apply（roster 行）。

触发按钮打开一个从输入框向上生长、保持在视口内的弹层面板（输入框位于屏幕底部，因此面板占据其上方空间，过高时在内部滚动）。面板列出每一个非 group 的 Loader entry，分为「插件」和用户标记的「常用插件」两组，并带按名字筛选。每行有启用/停用开关和「常用」标记按钮。两个写入都走 `pluginInventory` 远程服务：`setEnabled` 把一个按 id 定向的 `disabled` 补丁写进 profile 的用户 patch 层（`cordis.patch.yml`），由启动器的 `watchUserPatches` 热重载，因此切换无需重启即可生效且重启后仍保留；`setFavorite` 写入 `plugin-favorites` 设置命名空间。面板只持有视图状态（打开、分组、查询、乐观行）——没有任何客户端业务状态。

## 截图

![插件控制面板：每行含常用爱心标记与启用开关](demo.png)

## 安装

在 `deepseek-harness` 仓库中，本包已经是 `packages/bundle/web-app/cordis.patch.yml` 里的一行，因此 `web` 部署经应用构建后即获得该面板，无需任何额外安装。

要把本包作为独立插件安装进自建的 profile，请通过 profile 的用户 patch 层添加该行——**不要**改 profile 根目录的 `cordis.yml`，启动器每次 boot 都会把它重写为空列表：

1. 让 profile 的 Loader 能解析到这个包：

   ```sh
   dsh plugin --profile web add ~/code/plugin-ui-controls
   ```

   `declares no dsh.bundle` 警告是正常的：这是客户端 UI 插件（`dsh.client`，不是 patch 层 bundle），因此它作为普通依赖安装，下一步由你自己组合这一行。

2. 用 `insert` 列表把该行插入 `~/.dsh/profiles/web/cordis.patch.yml`——裸 `- id:` 行是 id 定向覆盖，不是新增行：

   ```yml
   - insert:
       - id: ui-plugin-controls
         name: '@deepseek-ai/dsh-client-ui-plugin-controls'
   ```

3. 重启 `dsh web` 并刷新浏览器。

标准 `web` profile 已经组合了该行所需的依赖——`@deepseek-ai/dsh-client-ui-conversation`（声明 `conversation.input.plugins` 席位）、`@deepseek-ai/dsh-api-remotes`、`@deepseek-ai/dsh-host-plugin-inventory`（提供 `list`/`setEnabled`/`setFavorite` 远程）和 `@deepseek-ai/dsh-client-locale`——所以只需这一条 `insert`。极简或自定义组合则需自行提供它们。

> 本包的 `peerDependencies` 使用仓库内的 `workspace:^` 协议，且对这个客户端半边而言仅用于类型。若要发布到 npm 独立安装，请先把它们改成可解析的版本范围。

## 模型体验

Indirectly, through the plugin-enablement toggles the panel drives; each toggled plugin owns what reaches the model.

#### KV Cache effect

切换一个贡献提示词段落的插件会改变组装后的前缀；只贡献工具的插件改变的是工具 schema 的 token 占用，而非前缀。

## 已知限制与暂缓事项

- **开关是 profile 级用户覆盖，不是沙箱边界** —— 停用插件把它从运行树中移除，但已经写入持久状态（文件、凭据）的插件会保留这些状态；重新启用会恢复其能力。
- **运行时效果依赖 patch 层监听器** —— 变更在监听器防抖窗口后才落地，并非与点击同步；面板用乐观渲染兜底。
- **启用是恢复组合默认值** —— 它移除用户的 `disabled: true` 补丁，而不是强制写 `disabled: false`，因此部署的平台开关始终有效。
- **设置的「插件列表」标签页没有常用控件** —— 常用标记和分组只存在于输入框旁的面板里。
