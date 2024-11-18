import { Hono } from "hono";
import { handle } from "hono/vercel";
import serverApp from "@server/src/index";

export const runtime = "edge";

const app = new Hono().basePath("/api");
app.route("/", serverApp);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);
