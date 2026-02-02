import { DocPagination } from "./components/doc-pagination";
import { DocSidebar } from "./components/doc-sidebar";
import { DocTOC } from "./components/doc-toc";
import { GButton } from "./plugins/deftheme/GButton";
import { DocXInterface, XMetaInterface } from "./types/interface";
// Sitename

export const XMeta: XMetaInterface = {
  siteName: "DocX - lixril",
  description:
    "Comprehensive documentation for DocX - A dynamic documentation generator framework built with Next.js",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://docxify.vercel.com",
  documentsPath: "content/docs",
  theme: {
    mdx: {
      highlighter: "pretty-code",
      theme: "github-light",
      keepBackground: false,
    },
    cssVars: {
      root: {
        "radius": "0.625rem"
      },
      light: {
        "primary": "oklch(0.21 0.006 285.885)",
        "primary-foreground": "oklch(0.985 0 0)"
      },
      dark: {
        "primary": "oklch(0.92 0.004 286.32)",
        "primary-foreground": "oklch(0.21 0.006 285.885)"
      }
    }
  },
  searchProvider: "local",
  interface: {
    components: {
      button: GButton,
      pagination: DocPagination,
      TOC: DocTOC,
      sidebar: DocSidebar,
    },
    styles: {
      
    },
  },
};
