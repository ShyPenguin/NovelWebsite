// For cookies
export const COOKIE_SESSION_KEY = "session-id";
export const SESSION_EXPIRATION_SECONDS = 60 * 60;
export const COOKIE_EXPIRATION = SESSION_EXPIRATION_SECONDS * 1000 * 24;
// For redis
export const REDIS_EXPIRATION = SESSION_EXPIRATION_SECONDS * 24;
export const RETURN_TO_COOKIE_KEY = "oauthReturnTo";
export const NOVEL_URL_SUPABASE_PATH = "novels/covers";
export const USER_URL_SUPABASE_PATH = "users/profile";
