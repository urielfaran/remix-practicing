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
    route("/update-board", "./routes/action/update-board.ts"),
    route("/update-list", "./routes/action/update-list.ts"),
    route("/share-board", "./routes/action/share-board.ts"),
    route(
      "/update-board-permission",
      "./routes/action/update-board-permission.ts"
    ),
    route("/update-todo-status", "./routes/action/update-todo-status.ts"),
    route(
      "/delete-board-permission",
      "./routes/action/delete-board-permission.ts"
    ),
    route("/add-todo-assignment", "./routes/action/add-todo-assignment.ts"),
    route(
      "/delete-todo-assignment",
      "./routes/action/delete-todo-assignment.ts"
    ),
    route(
      "/update-user-credentials",
      "./routes/action/update-user-credentials.ts"
    ),
    route("/logout", "./routes/action/logout.ts"),
    route("/notifications", "./routes/action/notifications.ts"),
    route("/notifications-test", "./routes/action/notifications-test.ts"),
    route("/set-notifications-status", "./routes/action/set-notifications-status.ts"),

    
  ]),
  layout("./routes/layout.tsx", [
    index("./routes/_index.tsx"),
    route("board/:id/:name", "./routes/board.tsx"),
  ]),
  route("/login", "./routes/login.tsx"),

  route("action/set-theme", "./routes/action.set-theme.ts"),
] satisfies RouteConfig;
