import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-47481a97/health", (c) => {
  return c.json({ status: "ok" });
});

// GET site content for a language
app.get("/make-server-47481a97/content/:lang", async (c) => {
  const lang = c.req.param("lang");
  const content = await kv.get(`content_${lang}`);
  return c.json({ content: content ?? null });
});

// POST (save) site content for a language
app.post("/make-server-47481a97/content/:lang", async (c) => {
  const lang = c.req.param("lang");
  const body = await c.req.json();
  await kv.set(`content_${lang}`, body.content);
  return c.json({ success: true });
});

// Verify admin password
app.post("/make-server-47481a97/admin/verify", async (c) => {
  const body = await c.req.json();
  const stored = await kv.get("admin_password");
  const password = stored ?? "pinea2024";
  return c.json({ ok: body.password === password });
});

Deno.serve(app.fetch);
