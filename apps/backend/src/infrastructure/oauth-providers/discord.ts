import z from "zod";
import { OAuthClient, OAuthUser } from "./base.js";

export function createDiscordOAuthClient() {
  return new OAuthClient({
    provider: "discord",
    clientId: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    scopes: [`email`, `identify`],
    urls: {
      auth: "https://discord.com/oauth2/authorize",
      token: "https://discord.com/api/oauth2/token",
      user: "https://discord.com/api/users/@me",
    },
    userInfo: {
      schema: z.object({
        id: z.string(), // Discord's user ID
        email: z.string().email(),
        global_name: z.string(),
        avatar: z.string().url().optional(),
      }),
      parser: (user) =>
        ({
          id: user.id,
          email: user.email,
          name: user.global_name,
          imageUrl: user.avatar ?? null,
        }) satisfies OAuthUser,
    },
  });
}
