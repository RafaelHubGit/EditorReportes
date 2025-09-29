// declare module "just-handlebars-helpers" {
//   import type * as Handlebars from "handlebars";
//     export function registerHelpers(hb: typeof Handlebars): void;
//     const _default: { registerHelpers: typeof registerHelpers } | ((opts: { handlebars: typeof Handlebars }) => void);
//     export default _default;
// }

declare module "just-handlebars-helpers" {
  const anyExport: any; // simple + safe
    export default anyExport;
}
