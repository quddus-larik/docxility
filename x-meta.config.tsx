import { CurvedUI } from "@/marketplace/curved-ui";
import { createConfig } from "@/lib/configuration";

/**
 * 💡 TIP FOR DEVELOPERS:
 * This file is your primary control center. You should mostly edit this file
 * and the 'content/' directory. Avoid changing files in 'lib/' or 'app/' 
 * unless you are extending the core framework logic.
 */

/**
 * 🚀 ACTIVE CONFIG
 * To switch designs, simply swap the spread theme (e.g., ...MinimalUI or ...MinimalUI)
 */
export const XMeta = createConfig({
  ...CurvedUI, // <-- CHANGE THEME HERE
  siteName: "DocXes",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://docxes.vercel.app",

  // 1. CUSTOM ROOT HEADER DESIGN
  // You can completely redefine the top navigation here
  header: ({ siteName, versions }) => (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl tracking-tight">{siteName}</div>
          <nav className="hidden md:flex gap-4 text-sm font-medium text-muted-foreground">
            <a href="/docs" className="hover:text-primary transition-colors">Documentation</a>
            <a href="/mvp" className="hover:text-primary transition-colors">Release Notes</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {/* Version Picker or Search can be added here */}
        </div>
      </div>
    </header>
  ),

  // 2. DELETE SIDEBAR HEADER
  // Simply set header to undefined to remove it from the sidebar
  sidebar: {
    ...CurvedUI.sidebar,
    header: undefined, 
  }
});

export default XMeta;
