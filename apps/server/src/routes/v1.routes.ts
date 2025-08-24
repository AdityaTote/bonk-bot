import { hono } from "@/lib/hono";
import { txnRouter } from "./v1Router/transactions.routes";
import { authRouter } from "./v1Router/auth.routes";

export const v1Router = hono();

v1Router.route("/auth", authRouter);
v1Router.route("/tnx", txnRouter);
