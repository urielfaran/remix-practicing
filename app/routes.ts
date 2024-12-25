import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/_index.tsx"),
    route("board/:id/:name", "./routes/board.tsx"),
  ]),
  route("action/set-theme", "./routes/action.set-theme.ts"),
] satisfies RouteConfig;
