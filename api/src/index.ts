type Env = {
  DB: D1Database;
};

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin") ?? "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const headers = corsHeaders(request);

    // App expects this during first-run setup
    if (method === "GET" && path === "/api/auth/check-setup") {
      return json({ isConfigured: false }, 200, headers);
    }

    if (method === "GET" && path === "/health") {
      return json({ ok: true }, 200, headers);
    }

    if (method === "GET" && path === "/clients") {
      const res = await env.DB
        .prepare("SELECT id, name, email, phone, created_at FROM clients ORDER BY id DESC")
        .all();
      return json({ clients: res.results }, 200, headers);
    }

    return json({ error: "Not Found", path }, 404, headers);
  },
};