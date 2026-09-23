// The shared logger, one line so both Netlify sites run the same code.
// Netlify bundles what an edge function imports, including from outside this folder.
export { default, config } from "../../../shared/netlify-traffic-logger.ts";
