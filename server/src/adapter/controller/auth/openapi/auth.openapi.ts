import { createRoute } from "@hono/zod-openapi";
import { ParamsSchema, UserSchema } from "@server/src/adapter/schema/schema";

export const route = createRoute({
  method: "get",
  path: "/users/{id}",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
      description: "Retrieve the user",
    },
  },
});
