// nylon3dp.com — thin Worker over the static Astro build in dist/.
// Pages-style _redirects is not processed for Workers static assets,
// so the legacy redirect and the custom 404 live here instead.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Legacy URL from the previous site: /Terms/ -> /terms/
    if (url.pathname === "/Terms" || url.pathname === "/Terms/") {
      url.pathname = "/terms/";
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) {
      const notFound = await env.ASSETS.fetch(new URL("/404.html", url.origin));
      return new Response(notFound.body, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return response;
  },
};
