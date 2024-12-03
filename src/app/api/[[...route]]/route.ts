import { handle } from "hono/vercel";
import serverApp from "@server/src/index";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const runtime: "nodejs" | "edge" = "nodejs";

const app = new OpenAPIHono().basePath("/api");
app.route("/", serverApp);
if (process.env.NODE_ENV !== "production") {
  app.doc("/doc", {
    info: {
      title: "An API",
      version: "v1",
    },
    openapi: "3.1.0",
  });

  // Swagger UIエンドポイント
  app.get("/ui", swaggerUI({ url: "/api/doc" }));
}

export type AppType = typeof app;

export { runtime };

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);
