import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/profile",
        "/my-list",
        "/watching",
      ],
    },
    sitemap: "https://flixpick.app/sitemap.xml",
    host: "https://flixpick.app",
  };
}
