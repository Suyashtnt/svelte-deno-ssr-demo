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

router
  .get("/", ({ response }) => {
    const { html } = App.render();
    const ssrPage = INDEX_PAGE.replace("%code%", html);

    response.status = 200;
    response.headers.set("Content-Type", "text/html"); // set to html if you want
    response.body = ssrPage;
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
