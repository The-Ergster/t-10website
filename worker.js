import { onRequestPost } from "./functions/api/contact.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed." }, 405);
      }

      return onRequestPost({ request, env, ctx });
    }

    return env.ASSETS.fetch(request);
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}