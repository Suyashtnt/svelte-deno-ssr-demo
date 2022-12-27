import App from "./index.svelte";

const app = new App({
  target: document.querySelector("#client"),
  hydrate: true,
});
