export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);

  const workerBase = "https://forge-fitness-api.abdulsalan1993.workers.dev";
  const target = new URL(workerBase);
  target.pathname = url.pathname;
  target.search = url.search;

  const init: RequestInit = {
    method: request.method,
    headers: request.headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  return fetch(target.toString(), init);
};