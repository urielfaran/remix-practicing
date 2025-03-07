import { createCookieSessionStorage } from "react-router";
import invariant from "tiny-invariant";

const sessionSecret = process.env.SESSION_SECRET;
invariant(sessionSecret, "SESSION_SECRET must be set in the configuration")
export const storage = createCookieSessionStorage({
  cookie: {
    name: "auth-session",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});
