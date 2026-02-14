import { DocPagination } from "./components/doc-pagination";
import { DocSidebar } from "./components/doc-sidebar";
import { DocTOC } from "./components/doc-toc";
import { Header } from "./components/header";
import { ModeToggle } from "./components/mode-toggle";
import { XMetaConfig } from "./types/interface";
import { CurvedUI } from "./marketplace/curved-ui";
import { MinimalUI } from "./marketplace/minimal-ui";

/**
 * 💡 TIP FOR DEVELOPERS:
 * This file is your primary control center. You should mostly edit this file
 * and the 'content/' directory. Avoid changing files in 'lib/' or 'app/' 
 * unless you are extending the core framework logic.
 */

const defaults: XMetaConfig = {
  siteName: "DocXes",
  description: "A dynamic documentation generator framework",
  siteUrl: "http://localhost:3000",
  documentsPath: "content/docs",
  searchProvider: "local",
  theme: {
    mdx: {
      highlighter: "pretty-code",
      theme: "github-dark",
      keepBackground: false,
    },
  },
  header: Header,
  modeToggle: ModeToggle,
  sidebar: { component: DocSidebar, styles: {} },
  toc: { component: DocTOC, styles: {} },
  pagination: { component: DocPagination, styles: {} },
  versions: { default: "v1" }
};


export const createConfig = (overrides: Partial<XMetaConfig> = {}): XMetaConfig => {
  return {
    ...defaults,
    ...overrides,
    theme: { ...defaults.theme, ...overrides.theme },
    sidebar: { ...defaults.sidebar, ...overrides.sidebar },
    toc: { ...defaults.toc, ...overrides.toc },
    pagination: { ...defaults.pagination, ...overrides.pagination },
    versions: { ...defaults.versions, ...overrides.versions },
  };
};

/* -------------------------------------------------------------------------- */
/*                            ACTIVE CONFIGURATION                            */
/* -------------------------------------------------------------------------- */

/**
 * 🚀 ACTIVE CONFIG
 * To switch designs, simply swap the spread theme (e.g., ...MinimalUI or ...MinimalUI)
 */
export const XMeta = createConfig({
  ...CurvedUI, // <-- CHANGE THEME HERE
  
  siteName: "DocXes",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://docxes.vercel.app",

  // Custom UI Overrides (Optional)
  sidebar: {
    ...CurvedUI.sidebar,
    header: ({ version }) => (
      <div className="px-6 py-8 border-b border-dashed bg-primary/5">
        <div className="font-black text-2xl tracking-tighter text-primary">DOCXES</div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1 opacity-60">
          Build {version}
        </div>
      </div>
    ),
  }
});

export default XMeta;
