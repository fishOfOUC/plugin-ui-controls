//#region src/invariant.ts
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-plugin-controls";
/** Cordis companion plugin name. */
const name = "client-ui-plugin-controls-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/** No runtime invariant: this package owns a composer seat reading a Host Remote. */
const install = () => {};
/** Register this package's invariant companion. */
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
