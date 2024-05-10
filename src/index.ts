import Elysia from "elysia";

import * as controllers from "./controllers";

const app = new Elysia().listen(3000).onError((err) => console.error(err));

app.use(controllers.IndexController);
app.use(controllers.CryptomusController);
app.use(controllers.DockerController);

console.log(
  `Server is running at http://localhost:${app.server?.port} in ${process.env.NODE_ENV?.toUpperCase()} mode`,
);
