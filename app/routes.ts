import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix("/action", [
    route("/favorite-board", "./routes/action/favorite-board.ts"),
    route("/delete-todo", "./routes/action/delete-todo.ts"),
    route("/delete-list", "./routes/action/delete-list.ts"),
    route("/delete-board", "./routes/action/delete-board.ts"),
  ]),
  layout("./routes/layout.tsx", [
    index("./routes/_index.tsx"),
    route("board/:id/:name", "./routes/board.tsx"),
  ]),
  route("action/set-theme", "./routes/action.set-theme.ts"),
] satisfies RouteConfig;
