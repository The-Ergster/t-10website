function getAssetPath(pathname) {
  const pageMatch = pathname.match(/^\/(contact|outreach|team|videos)(?:\.html)?$/);
  if (pageMatch) return `/pages/${pageMatch[1]}.html`;

  if (/^\/(css|js|images)(\/|$)/.test(pathname)) {
    return `/assets${pathname}`;
  }

  if (/^\/(robots\.txt|sitemap\.xml|2968cb6aad77f1ca6f30434066847862\.txt)$/.test(pathname)) {
    return `/site${pathname}`;
  }

  return pathname;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === "http:" && !["localhost", "127.0.0.1"].includes(url.hostname)) {
      url.protocol = "https:";
      return Response.redirect(url, 301);
    }

    url.pathname = getAssetPath(url.pathname);
    return env.ASSETS.fetch(new Request(url, request));
  },
};