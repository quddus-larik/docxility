import type { DocSidebarStyles } from "@/components/doc-sidebar";

export interface XMetaConfig {
  siteName: string;
  description: string;
  siteUrl: string;
  documentsPath: string;
  searchProvider: string;
  theme: {
    mdx?: {
      highlighter?: string;
      theme?: string;
      keepBackground?: boolean;
    };
    cssVars?: {
      light?: Record<string, string>;
      dark?: Record<string, string>;
      root?: Record<string, string>;
    };
  };
  sidebar: {
    component?: React.ComponentType<any>;
    header?: React.ComponentType<any>;
    footer?: React.ComponentType<any>;
    styles?: DocSidebarStyles;
  };
  toc: {
    component?: React.ComponentType<any>;
    header?: React.ComponentType<any>;
    footer?: React.ComponentType<any>;
    styles?: DocTOCStyles;
  };
  pagination: {
    component?: React.ComponentType<any>;
    styles?: DocPaginationStyles;
  };
  versions: {
    default: string;
  };
  header?: React.ComponentType<any>;
  footer?: React.ComponentType<any>;
  button?: React.ComponentType<any>;
}

export interface XMetaInterface extends XMetaConfig {}

export interface DocTOCStyles {
  container?: string;
  nav?: string;
  title?: string;
  item?: string;
  itemActive?: string;
}

export interface DocPaginationStyles {
  container?: string;
  button?: string;
  prevLabel?: string;
  nextLabel?: string;
  title?: string;
}
