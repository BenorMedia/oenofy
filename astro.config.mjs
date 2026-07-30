import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

// Fully static build for now — no CMS/dynamic routes yet. If OENOFY later
// needs on-demand rendering (gated pages via Wized/Memberstack, CMS-driven
// News/Collection pages), switch `output` to "server" and this adapter
// handles both modes without further config changes.
export default defineConfig({
  output: "static",
  adapter: vercel(),
});
