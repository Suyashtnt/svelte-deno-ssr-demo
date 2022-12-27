import App from "../bundle/App.js";

const app = new App({
  target: document.querySelector("#client"),
  hydrate: true,
});
