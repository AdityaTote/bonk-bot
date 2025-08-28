import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { hono } from "./lib/hono";
import { v1Router } from "./routes/v1.routes";

const app = hono();

app.use(logger());
app.use(
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
		allowHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(prettyJSON());

app.get("/", (c) => c.text("Hello Hono!"));

app.route("/api/v1", v1Router);

export default app;
