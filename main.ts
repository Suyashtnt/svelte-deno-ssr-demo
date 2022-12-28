import App from "./bundle/ssr.js";
import {
  Application,
  FlashServer,
  hasFlash,
  Router,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

const router = new Router();

const INDEX_PAGE = await Deno.readTextFile("./handWritten/index.html");
const INDEX_JS = await Deno.readTextFile("./bundle/client.js");

const CUSTOM_ELEMENTS_PAGE = await Deno.readTextFile('./handWritten/customElements.html')
const CUSTOM_ELEMENTS_JS = await Deno.readTextFile('./bundle/component.js')

router
  .get("/", ({ response }) => {
    const { html } = App.render();
    const ssrPage = INDEX_PAGE.replace("%code%", html);

    response.status = 200;
    response.headers.set("Content-Type", "text/html");
    response.body = ssrPage;
  })
  .get("/customElements", ({ response }) => {
    response.status = 200;
    response.headers.set("Content-Type", "text/html");
    response.body = CUSTOM_ELEMENTS_PAGE;
  })
  .get("/component.js", ({ response }) => {
    response.status = 200;
    response.headers.set("Content-Type", "text/javascript");
    response.body = CUSTOM_ELEMENTS_JS;
  })
  .get("/index.css", ({ response }) => {
    const { css } = App.render();

    response.status = 200;
    response.headers.set("Content-Type", "text/css");
    response.body = css.code;
  })
  .get("/index.js", ({ response }) => {
    response.status = 200;
    response.headers.set("Content-Type", "text/javascript");
    response.body = INDEX_JS;
  });

const appOptions = hasFlash() ? { serverConstructor: FlashServer } : undefined;
const app = new Application(appOptions);
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
