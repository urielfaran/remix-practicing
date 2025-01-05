import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix("/action", [
    route("/complete-todo", "./routes/action/complete-todo.ts"),
    route("/favorite-board", "./routes/action/favorite-board.ts"),
    route("/delete-todo", "./routes/action/delete-todo.ts"),
    route("/delete-list", "./routes/action/delete-list.ts"),
    route("/delete-board", "./routes/action/delete-board.ts"),
    route("/update-board", "./routes/action/update-board.ts"),
    route("/update-list", "./routes/action/update-list.ts"),
    route("/logout", "./routes/action/logout.ts"),

  ]),
  layout("./routes/layout.tsx", [
    index("./routes/_index.tsx"),
    route("board/:id/:name", "./routes/board.tsx"),
  ]),
  route("/login", "./routes/login.tsx"),

  route("action/set-theme", "./routes/action.set-theme.ts"),
] satisfies RouteConfig;
