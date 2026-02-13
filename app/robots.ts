import { MetadataRoute } from "next"
import { XMeta } from "@/x-meta.config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/static/"], 
      },
    ],
    sitemap: `${XMeta.siteUrl}/sitemap.xml`,
  }
}
