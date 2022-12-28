import "npm:typescript";
import "npm:less";

import sveltePreprocess from "npm:svelte-preprocess";

import { build, stop } from "https://deno.land/x/esbuild@v0.16.11/mod.js";
import { httpImports } from "https://deno.land/x/esbuild_plugin_http_imports@v1.2.4/index.ts";
import sveltePlugin from "npm:esbuild-svelte";
import { BuildOptions } from "../.cache/deno/npm/registry.npmjs.org/typescript/4.9.4/lib/typescript.d.ts";


// @ts-expect-error typescript what cocaine are you on that this isn't callable
const preprocessor = sveltePreprocess();

const bundleExists = await Deno.stat("bundle").catch(() => false);
if (bundleExists) await Deno.remove("bundle", { recursive: true });

await Deno.mkdir("bundle", { recursive: true });

const sveltePath = "https://esm.sh/svelte@3.55.0";
const defaultSvelteOpts = {
  preprocess: preprocessor,
  compilerOptions: {
    generate: "dom",
    hydratable: true,
    sveltePath,
  },
}

const httpImport = httpImports({
  defaultToJavascriptIfNothingElseFound: true,
});

const defaultEsbuildOpts: BuildOptions = {
  mainFields: ["svelte", "browser", "module", "main"],
  metafile: true,
  bundle: true,
  minify: true,
  format: "esm",
};


const client = await build({
  ...defaultEsbuildOpts,
  plugins: [
    // @ts-expect-error typescript what cocaine are you on that this isn't callable
    sveltePlugin(defaultSvelteOpts),
    httpImport
  ],
  entryPoints: ["./handWritten/client.js"],
  outfile: "./bundle/client.js",
});

const server = await build({
  ...defaultEsbuildOpts,
  plugins: [
    // @ts-expect-error typescript what cocaine are you on that this isn't callable
    sveltePlugin({
      ...defaultSvelteOpts,
      compilerOptions: {
        ...defaultSvelteOpts.compilerOptions,
        generate: "ssr",
      },
    }),
    httpImport
  ],
  entryPoints: ["./handWritten/index.svelte"],
  outfile: "./bundle/ssr.js",
});

// web component test
const webComponent = await build({
  ...defaultEsbuildOpts,
  plugins: [
    // @ts-expect-error typescript what cocaine are you on that this isn't callable
    sveltePlugin({
      ...defaultSvelteOpts,
      compilerOptions: {
        ...defaultSvelteOpts.compilerOptions,
        customElement: true,
      },
    }),
    httpImport
  ],
  entryPoints: ["./handWritten/component.svelte"],
  outfile: "./bundle/component.js",
});

await Deno.writeTextFile("./bundle/client.meta.json", JSON.stringify(client.metafile));
await Deno.writeTextFile("./bundle/ssr.meta.json", JSON.stringify(server.metafile));
await Deno.writeTextFile("./bundle/component.meta.json", JSON.stringify(webComponent.metafile));

stop();
