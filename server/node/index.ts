import "reflect-metadata";

import { OpenAPIHono } from "@hono/zod-openapi";
import app from "@server/src/index";
import { serve } from "@hono/node-server";

import { createSecureServer } from "node:http2";
import { readFileSync } from "node:fs";
import { swaggerUI } from "@hono/swagger-ui";

const PORT = 8080;

async function main() {
  try {
    const serverApp = new OpenAPIHono();

    if (process.env.NODE_ENV !== "production") {
      serverApp.doc("/doc", {
        info: {
          title: "An API",
          version: "v1",
        },
        openapi: "3.1.0",
      });

      // Swagger UIエンドポイント
      serverApp.get("/ui", swaggerUI({ url: "/api/doc" }));
    }

    // アプリケーションルートの設定
    serverApp.route("/api", app);

    // サーバ起動
    serve({
      fetch: serverApp.fetch,
      port: PORT,
      createServer: createSecureServer,
      serverOptions: {
        key: readFileSync("certificates/privatekey.pem"),
        cert: readFileSync("certificates/cert.pem"),
      },
    });
    console.log(`Server running on https://localhost:${PORT}/api`);
    console.log(`Swagger UI available at https://localhost:${PORT}/api/ui`);
  } catch (e) {
    console.error("Failed to start server");
    console.error(e);
  }
}

(async () => {
  await main();
})();
