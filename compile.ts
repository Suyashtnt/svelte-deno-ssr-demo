import "npm:typescript";
import "npm:less";

import sveltePreprocess from "npm:svelte-preprocess";

import { build, stop } from "https://deno.land/x/esbuild@v0.16.11/mod.js";
import { httpImports } from "https://deno.land/x/esbuild_plugin_http_imports@v1.2.4/index.ts";
import sveltePlugin from "npm:esbuild-svelte";

const sveltePath = "https://esm.sh/svelte@3.55.0";

// @ts-expect-error typescript what cocaine are you on that this isn't callable
const preprocessor = sveltePreprocess();

await Deno.mkdir("bundle", { recursive: true });

const client = await build({
  plugins: [
    sveltePlugin({
      preprocess: preprocessor,
      compilerOptions: {
        generate: "dom",
        hydratable: true,
        sveltePath,
      },
    }),
    httpImports({
      defaultToJavascriptIfNothingElseFound: true,
    }),
  ],
  entryPoints: ["./handWritten/client.js"],
  mainFields: ["svelte", "browser", "module", "main"],
  outfile: "./bundle/client.js",
  metafile: true,
  bundle: true,
  minify: true,
  format: "esm",
});

const server = await build({
  plugins: [
    sveltePlugin({
      preprocess: preprocessor,
      compilerOptions: {
        generate: "ssr",
        hydratable: true,
        sveltePath,
      },
    }),
    httpImports({
      defaultToJavascriptIfNothingElseFound: true,
    }),
  ],
  entryPoints: ["./handWritten/index.svelte"],
  mainFields: ["svelte", "browser", "module", "main"],
  outfile: "./bundle/ssr.js",
  metafile: true,
  bundle: true,
  minify: true,
  format: "esm",
});

stop();
