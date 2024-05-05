import Elysia from "elysia";

export const DockerController = (app: Elysia) => {
  app.get("/health", () => {
    return "ok";
  });

  return Promise.resolve(app);
};
