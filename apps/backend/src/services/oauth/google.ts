import { OAuthClient, OAuthUser } from "./base.ts";
import { z } from "zod";
import "dotenv/config";

export const googleDocSchema = z.object({
  title: z.string(),
  body: z.object({
    content: z.array(z.any()),
  }),
});

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: "google",
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    scopes: ["openid", `email`, `profile`],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    userInfo: {
      schema: z.object({
        sub: z.string(), // Google's user ID
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url().optional(),
      }),
      parser: (user) =>
        ({
          id: user.sub,
          email: user.email,
          name: user.name,
          imageUrl: user.picture ?? null,
        }) satisfies OAuthUser,
    },
  });
}
