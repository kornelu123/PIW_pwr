// routes.js
import { index } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  { path: "new", file: "routes/new.jsx" },
];
