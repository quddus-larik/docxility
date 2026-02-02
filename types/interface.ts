import type { DocSidebarStyles } from "@/components/doc-sidebar";

export interface XMetaInterface {
  siteName: string,
  description: string,
  siteUrl: string,
  documentsPath: string,
  searchProvider: string,
  interface: DocXInterface,
  theme: DocXThemeInterface
}

export interface InterfaceComponents {
  sidebar?: React.ComponentType<any>;
  pagination?: React.ComponentType<any>;
  TOC?: React.ComponentType<any>;
  button?: React.ComponentType<any>;
}

export interface InterfaceStyles {
  sidebar?: DocSidebarStyles;
}

export interface DocXInterface {
  components?: InterfaceComponents;
  styles?: InterfaceStyles;
}

interface DocXThemeInterface {
  mdx: {
    highlighter: string,
    theme: string,
    keepBackground: boolean
  },
  cssVars?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    root?: Record<string, string>; // For non-color vars like radius
  }
}
