import { OpenAPIHono } from "@hono/zod-openapi";
import app from "@server/src/index";

const PORT = 8080;

async function main() {
  try {
    if (typeof process !== "undefined" && process.release?.name === "node") {
      const serverApp = new OpenAPIHono().basePath("/api");
      serverApp.route("/", app);
      serverApp.doc("/doc", {
        info: {
          title: "An API",
          version: "v1",
        },
        openapi: "3.1.0",
      });
      const { serve } = await import("@hono/node-server");
      serve({
        fetch: serverApp.fetch,
        port: PORT,
      });
    }
  } catch (e) {
    console.error("Failed to start server");
    console.error(e);
  }
}

await main();
console.log(`Server running on http://localhost:${PORT}`);
