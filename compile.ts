import "npm:typescript";
import "npm:less";

import sveltePreprocess from "npm:svelte-preprocess";
import { compile, preprocess } from "npm:svelte/compiler";

import { build, stop } from "https://deno.land/x/esbuild@v0.16.11/mod.js";
import { httpImports } from "https://deno.land/x/esbuild_plugin_http_imports@v1.2.4/index.ts";

const filename = "handWritten/index.svelte";
const sveltePath = "https://esm.sh/svelte@3.55.0";
const FILE = Deno.readTextFileSync(filename);

// @ts-expect-error typescript what cocaine are you on that this isn't callable
const preprocessor = sveltePreprocess();

const preprocessed = await preprocess(FILE, preprocessor, {
  filename,
});

const ssr = compile(preprocessed.code, {
  hydratable: true,
  generate: "ssr",
  sveltePath,
});

const csr = compile(preprocessed.code, {
  hydratable: true,
  generate: "dom",
  sveltePath,
});

const serverBundle: string = ssr.js.code;
const clientBundle: string = csr.js.code;

await Deno.mkdir("bundle", { recursive: true });
await Promise.all(
  [
    Deno.writeTextFile("bundle/ssr.js", serverBundle),
    Deno.writeTextFile("bundle/App.js", clientBundle),
  ],
);

const result = await build({
  plugins: [httpImports({
    defaultToJavascriptIfNothingElseFound: true,
  })],
  entryPoints: ["./handWritten/client.js"],
  outfile: "./bundle/index.js",
  bundle: true,
  format: "esm",
});

stop();
