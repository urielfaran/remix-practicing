// import { createCookieSessionStorage } from "@remix-run/node";
import { createCookieSessionStorage } from "react-router";
import invariant from "tiny-invariant";

// session to be used in the application

/**
 * Cookie session storage configuration for authentication sessions.
 *
 * This code sets up a cookie-based session storage system using `createCookieSessionStorage`.
 * The configuration ensures secure and efficient handling of authentication sessions in
 * the application.
 */
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
