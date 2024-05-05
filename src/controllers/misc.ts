import Elysia from "elysia";

export const IndexController = (app: Elysia) => {
  app.get("/", () => {
    return "looks like you're lost, go away!";
  });

  return Promise.resolve(app);
};
