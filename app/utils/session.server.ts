import { createCookieSessionStorage } from "react-router";

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
});

export { getSession, commitSession };
