window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-plugin-controls",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		let react_dom = require("react-dom");
		let clsx = require("clsx");
		clsx = __toESM(clsx, 1);
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/home/night_star/code/plugin-ui-controls/src/client/PluginControls.module.css.mjs
		const css = ".dshPluginControls_trigger{min-width:0;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:24px;outline:none;align-items:center;gap:4px;padding:0 8px;font-size:13px;font-weight:500;line-height:20px;display:inline-flex}.dshPluginControls_trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.dshPluginControls_trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}.dshPluginControls_trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.dshPluginControls_triggerLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.dshPluginControls_panel{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-overlay);width:320px;box-shadow:0 8px 24px var(--dsw-alias-bg-mask-2);z-index:1000;border-radius:12px;flex-direction:column;gap:8px;padding:8px;display:flex;position:fixed}.dshPluginControls_tabs{border-bottom:1px solid var(--dsw-alias-border-l3);gap:4px;padding-bottom:8px;display:flex}.dshPluginControls_tab{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:8px;padding:4px 10px;font-size:13px;line-height:20px}.dshPluginControls_tab:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshPluginControls_tabActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active)}.dshPluginControls_search{border:1px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-caption);border-radius:8px;align-items:center;gap:6px;padding:6px 8px;display:flex}.dshPluginControls_search input{min-width:0;color:var(--dsw-alias-label-primary);background:0 0;border:none;outline:none;flex:1;font-size:13px;line-height:20px}.dshPluginControls_list{overscroll-behavior:contain;flex:1;min-height:0;overflow-y:auto}.dshPluginControls_status{color:var(--dsw-alias-label-caption);margin:8px;font-size:13px;line-height:20px}.dshPluginControls_failure{align-items:center;gap:8px;margin:8px;display:flex}.dshPluginControls_failure p{color:var(--dsw-alias-label-caption);margin:0;font-size:13px;line-height:20px}.dshPluginControls_failure button{border:1px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border-radius:8px;padding:2px 10px;font-size:13px;line-height:20px}.dshPluginControls_rows{margin:0;padding:0;list-style:none}.dshPluginControls_row{border-radius:8px;align-items:center;gap:8px;padding:6px 8px;display:flex}.dshPluginControls_row:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshPluginControls_favorite{color:var(--dsw-alias-label-dimmed);cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;padding:2px;display:inline-flex}.dshPluginControls_favorite:hover{color:var(--dsw-alias-label-secondary)}.dshPluginControls_favoriteActive{color:var(--dsw-static-red-500)}.dshPluginControls_name{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;line-height:20px;overflow:hidden}.dshPluginControls_switch{background:var(--dsw-static-red-500);cursor:pointer;border:none;border-radius:999px;flex:none;width:34px;height:18px;transition:background .12s;position:relative}.dshPluginControls_switchOn{background:var(--dsw-static-green-500)}.dshPluginControls_thumb{background:var(--dsw-alias-bg-base);border-radius:50%;width:14px;height:14px;transition:transform .12s;position:absolute;top:2px;left:2px}.dshPluginControls_switchOn .dshPluginControls_thumb{transform:translate(16px)}";
		const tagId = "@deepseek-ai/dsh-client-ui-plugin-controls/PluginControls.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-plugin-controls";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var PluginControls_module_css_default = {
			"failure": "dshPluginControls_failure",
			"favorite": "dshPluginControls_favorite",
			"favoriteActive": "dshPluginControls_favoriteActive",
			"list": "dshPluginControls_list",
			"name": "dshPluginControls_name",
			"panel": "dshPluginControls_panel",
			"row": "dshPluginControls_row",
			"rows": "dshPluginControls_rows",
			"search": "dshPluginControls_search",
			"status": "dshPluginControls_status",
			"switch": "dshPluginControls_switch",
			"switchOn": "dshPluginControls_switchOn",
			"tab": "dshPluginControls_tab",
			"tabActive": "dshPluginControls_tabActive",
			"tabs": "dshPluginControls_tabs",
			"thumb": "dshPluginControls_thumb",
			"trigger": "dshPluginControls_trigger",
			"triggerLabel": "dshPluginControls_triggerLabel"
		};
		//#endregion
		//#region src/client/PluginControls.tsx
		/** Fixed panel width in px; the right-edge clamp below needs it before layout. */
		const PANEL_WIDTH = 320;
		/** Distance between the panel's bottom edge and the trigger's top edge. */
		const GAP = 8;
		/** Viewport clearance on every side (mirrors the Menu portal margin). */
		const MARGIN = 12;
		/** Design cap on the panel height, as a fraction of the viewport. */
		const MAX_HEIGHT_VH = .6;
		/**
		* Floor for the height clamp: a viewport with less room than this above the
		* composer gets an overlapping panel rather than an unusable sliver.
		*/
		const MIN_HEIGHT = 160;
		/** Compact a module specifier without guessing whether its Loader id was generated. */
		function moduleShortName(moduleName) {
			return (moduleName.startsWith("@") ? moduleName.slice(moduleName.indexOf("/") + 1) : moduleName).replace(/^cordis:/, "").replace(/^cordis-plugin-/, "").replace(/^dsh-(?:host-|client-)?/, "");
		}
		/** Whether one inventory row matches the local query. */
		function matches(entry, normalizedQuery) {
			if (normalizedQuery.length === 0) return true;
			return [entry.moduleName, moduleShortName(entry.moduleName)].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
		}
		/** Replace one entry in place, preserving order. */
		function patchEntry(entries, entryId, patch) {
			return entries.map((entry) => entry.entryId === entryId ? {
				...entry,
				...patch
			} : entry);
		}
		/** Replace one entry's favorite flag by module name, preserving order. */
		function patchFavorite(entries, moduleName, favorite) {
			return entries.map((entry) => entry.moduleName === moduleName ? {
				...entry,
				favorite
			} : entry);
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
		function PluginControls({ list, setEnabled, setFavorite, locked, t }) {
			const triggerRef = (0, react.useRef)(null);
			const panelRef = (0, react.useRef)(null);
			const [open, setOpen] = (0, react.useState)(false);
			const [group, setGroup] = (0, react.useState)("all");
			const [query, setQuery] = (0, react.useState)("");
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			const [status, setStatus] = (0, react.useState)("idle");
			const [request, setRequest] = (0, react.useState)(0);
			const [position, setPosition] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (!open) return;
				let current = true;
				setStatus("loading");
				Promise.resolve().then(list).then((value) => {
					if (current) {
						setSnapshot(value);
						setStatus("idle");
					}
				}, () => {
					if (current) setStatus("error");
				});
				return () => {
					current = false;
				};
			}, [
				open,
				list,
				request
			]);
			(0, react.useLayoutEffect)(() => {
				if (!open) {
					setPosition(null);
					return;
				}
				const update = () => {
					const rect = triggerRef.current?.getBoundingClientRect();
					/* v8 ignore next -- the ref is attached before this layout effect runs and the listeners die with it. */
					if (rect === void 0) return;
					setPosition({
						bottom: window.innerHeight - rect.top + GAP,
						right: Math.min(Math.max(MARGIN, window.innerWidth - rect.right), window.innerWidth - PANEL_WIDTH - MARGIN),
						maxHeight: Math.max(Math.min(window.innerHeight * MAX_HEIGHT_VH, rect.top - GAP - MARGIN), MIN_HEIGHT)
					});
				};
				update();
				window.addEventListener("resize", update);
				window.addEventListener("scroll", update, true);
				return () => {
					window.removeEventListener("resize", update);
					window.removeEventListener("scroll", update, true);
				};
			}, [open]);
			(0, react.useEffect)(() => {
				if (!open) return;
				const onPointerDown = (event) => {
					const target = event.target;
					if (triggerRef.current?.contains(target) === true) return;
					if (panelRef.current?.contains(target) === true) return;
					setOpen(false);
				};
				const onKeyDown = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				document.addEventListener("pointerdown", onPointerDown);
				document.addEventListener("keydown", onKeyDown);
				return () => {
					document.removeEventListener("pointerdown", onPointerDown);
					document.removeEventListener("keydown", onKeyDown);
				};
			}, [open]);
			(0, react.useEffect)(() => {
				if (locked) setOpen(false);
			}, [locked]);
			const normalizedQuery = query.trim().toLocaleLowerCase();
			const filtered = (0, react.useMemo)(() => {
				if (snapshot === null) return [];
				return (group === "favorites" ? snapshot.entries.filter((entry) => entry.favorite) : snapshot.entries).filter((entry) => matches(entry, normalizedQuery));
			}, [
				snapshot,
				group,
				normalizedQuery
			]);
			/** Apply one entries transform to the loaded snapshot. */
			const applyEntries = (transform) => {
				setSnapshot((prev) => {
					/* v8 ignore next -- rows render only from a loaded snapshot; the null arm
					keeps the updater total while a (re)load is in flight. */
					if (prev === null) return prev;
					return { entries: transform(prev.entries) };
				});
			};
			const toggleEnabled = (entry) => {
				const next = !entry.enabled;
				applyEntries((entries) => patchEntry(entries, entry.entryId, { enabled: next }));
				setEnabled(entry.entryId, next).catch(() => {
					applyEntries((entries) => patchEntry(entries, entry.entryId, { enabled: entry.enabled }));
				});
			};
			const toggleFavorite = (entry) => {
				const next = !entry.favorite;
				applyEntries((entries) => patchFavorite(entries, entry.moduleName, next));
				setFavorite(entry.moduleName, next).catch(() => {
					applyEntries((entries) => patchFavorite(entries, entry.moduleName, entry.favorite));
				});
			};
			const retry = () => {
				setRequest((value) => value + 1);
			};
			const panelId = (0, react.useId)();
			const panel = open && position !== null ? (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: panelRef,
				className: PluginControls_module_css_default.panel,
				id: panelId,
				role: "dialog",
				"aria-label": t("panel.title"),
				style: {
					bottom: position.bottom,
					right: position.right,
					maxHeight: position.maxHeight
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: PluginControls_module_css_default.tabs,
						role: "tablist",
						"aria-label": t("panel.title"),
						children: [["all", t("group.all")], ["favorites", t("group.favorites")]].map(([key, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": group === key,
							className: (0, clsx.default)(PluginControls_module_css_default.tab, group === key && PluginControls_module_css_default.tabActive),
							onClick: () => {
								setGroup(key);
							},
							children: label
						}, key))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: PluginControls_module_css_default.search,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { "aria-hidden": "true" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "search",
							value: query,
							placeholder: t("panel.search"),
							"aria-label": t("panel.search"),
							onChange: (event) => {
								setQuery(event.currentTarget.value);
							}
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginControls_module_css_default.list,
						"aria-busy": status === "loading",
						children: [
							status === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: PluginControls_module_css_default.status,
								children: t("loading")
							}) : null,
							status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: PluginControls_module_css_default.failure,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									role: "alert",
									children: t("error")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: retry,
									children: t("retry")
								})]
							}) : null,
							status === "idle" && filtered.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: PluginControls_module_css_default.status,
								children: group === "favorites" ? normalizedQuery.length === 0 ? t("empty.favorites") : t("empty.search") : snapshot !== null && snapshot.entries.length === 0 ? t("empty") : t("empty.search")
							}) : null,
							status === "idle" && filtered.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: PluginControls_module_css_default.rows,
								children: filtered.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
									className: PluginControls_module_css_default.row,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: PluginControls_module_css_default.name,
											title: entry.moduleName,
											children: moduleShortName(entry.moduleName)
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: (0, clsx.default)(PluginControls_module_css_default.favorite, entry.favorite && PluginControls_module_css_default.favoriteActive),
											"aria-pressed": entry.favorite,
											"aria-label": entry.favorite ? t("row.unfavorite") : t("row.favorite"),
											onClick: () => {
												toggleFavorite(entry);
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconHeart16, { size: 14 })
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											role: "switch",
											"aria-checked": entry.enabled,
											"aria-label": entry.enabled ? t("row.disable") : t("row.enable"),
											className: (0, clsx.default)(PluginControls_module_css_default.switch, entry.enabled && PluginControls_module_css_default.switchOn),
											onClick: () => {
												toggleEnabled(entry);
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: PluginControls_module_css_default.thumb })
										})
									]
								}, entry.entryId))
							}) : null
						]
					})
				]
			}), document.body) : null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				ref: triggerRef,
				type: "button",
				className: PluginControls_module_css_default.trigger,
				"aria-haspopup": "dialog",
				"aria-expanded": open,
				"aria-controls": open ? panelId : void 0,
				"aria-label": t("trigger.aria"),
				disabled: locked,
				onClick: () => {
					setOpen((value) => !value);
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCordisPluginOutline14, { size: 14 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: PluginControls_module_css_default.triggerLabel,
					children: t("trigger")
				})]
			}), panel] });
		}
		//#endregion
		//#region src/client/locales.ts
		/** Copy dictionaries for the composer plugin-control panel. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "pluginControls";
		/** Simplified Chinese dictionary and key source of truth. */
		const zh = {
			trigger: "插件",
			"trigger.aria": "打开插件控制面板",
			"panel.title": "插件",
			"panel.search": "搜索插件",
			loading: "正在读取插件…",
			"group.all": "插件",
			"group.favorites": "常用插件",
			"row.favorite": "标记为常用",
			"row.unfavorite": "取消常用标记",
			"row.enable": "启用插件",
			"row.disable": "停用插件",
			empty: "暂无插件。",
			"empty.search": "没有匹配的插件。",
			"empty.favorites": "还没有标记常用的插件。",
			error: "暂时无法读取插件。",
			retry: "重试"
		};
		/** English dictionary checked against the Chinese key set. */
		const en = {
			trigger: "Plugins",
			"trigger.aria": "Open the plugin control panel",
			"panel.title": "Plugins",
			"panel.search": "Search plugins",
			loading: "Reading plugins…",
			"group.all": "Plugins",
			"group.favorites": "Favorites",
			"row.favorite": "Mark as favorite",
			"row.unfavorite": "Remove favorite mark",
			"row.enable": "Enable plugin",
			"row.disable": "Disable plugin",
			empty: "No plugins are available.",
			"empty.search": "No matching plugins.",
			"empty.favorites": "No favorite plugins yet.",
			error: "Plugins are temporarily unavailable.",
			retry: "Retry"
		};
		//#endregion
		//#region src/client/index.ts
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"remote",
			"remote.pluginInventory"
		];
		/**
		* Client plugin body: register the plugin-control trigger over the composer seat.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-plugin-controls: dictionaries");
			const injected = (_sessionId) => ({
				list: async () => {
					const result = await ctx.remote.pluginInventory.list();
					if (!result.ok) throw new Error(`pluginInventory.list failed: ${result.error.code}: ${result.error.message}`);
					return result.value;
				},
				setEnabled: async (entryId, enabled) => {
					const result = await ctx.remote.pluginInventory.setEnabled({
						entryId,
						enabled
					});
					if (!result.ok) throw new Error(`pluginInventory.setEnabled failed: ${result.error.code}: ${result.error.message}`);
				},
				setFavorite: async (moduleName, favorite) => {
					const result = await ctx.remote.pluginInventory.setFavorite({
						moduleName,
						favorite
					});
					if (!result.ok) throw new Error(`pluginInventory.setFavorite failed: ${result.error.code}: ${result.error.message}`);
				}
			});
			ctx.slots.inject("conversation.input.plugins", () => ctx.slots.register({
				name: "conversation.input.plugins",
				locale: NS,
				inject: injected
			}, PluginControls));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map