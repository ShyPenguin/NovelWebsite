import { Router } from "express";
import { redirectOAuthURL } from "../controllers/oauthControllers/redirect.ts";
import { login } from "../controllers/oauthControllers/login.ts";
import { logout } from "../controllers/oauthControllers/logout.ts";
import { me } from "../controllers/oauthControllers/me.ts";

const oauthRoutes = Router();

oauthRoutes.get("/redirect/:provider", redirectOAuthURL);
oauthRoutes.get("/login/:provider", login);
oauthRoutes.post("/logout", logout);
oauthRoutes.get("/me", me);
export default oauthRoutes;
