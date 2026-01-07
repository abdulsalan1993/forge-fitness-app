export const onRequest: PagesFunction = async ({ request, params }) => {
  const workerBase = "https://forge-fitness-api.abdulsalan1993.workers.dev";
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path ?? "");
  const url = new URL(request.url);

  const target = new URL(workerBase);
  target.pathname = "/api/" + path;
  target.search = url.search;

  // Forward method + headers + body
  const init: RequestInit = {
    method: request.method,
    headers: request.headers,
  };

  // Only forward body on non-GET/HEAD
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const resp = await fetch(target.toString(), init);

  // Return response as-is
  return new Response(resp.body, {
    status: resp.status,
    headers: resp.headers,
  });
};