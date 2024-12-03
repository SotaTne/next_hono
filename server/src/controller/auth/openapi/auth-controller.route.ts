import { createRoute } from "@hono/zod-openapi";

export const oauthLoginGoogleRoute = createRoute({
  method: "get",
  path: "/login/google",
  description: "Google OAuth",
  responses: {
    200: {
      description: "call back to Google OAuth",
    },
    302: {
      description: "Redirect",
    },
  },
});
export const oauthLoginDiscordRoute = createRoute({
  method: "get",
  path: "/login/discord",
  description: "Discord OAuth",
  responses: {
    200: {
      description: "call back to Discord OAuth",
    },
    302: {
      description: "Redirect",
    },
  },
});
