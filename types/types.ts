export interface DocMeta {
  title: string
  description?: string
  order?: number
  badge?: string
}

export interface DocHeading {
  level: number
  text: string
  id: string
}

export interface DocFile {
  slug: string[]
  path: string
  title: string
  description?: string
  content: string
  headings: DocHeading[]
  rawContent?: string
  metadata?: DocMeta
}

export interface NavItem {
  title: string
  href: string
}

export interface DocNavItem {
  title: string
  href?: string
  items?: DocNavItem[]
  isIndex?: boolean
  hasMainFile?: boolean
}

export interface SearchableDoc {
  id: string
  title: string
  description?: string
  content: string
  keywords?: string[]
  version: string
  href: string
}

export interface SearchResult {
  id: string
  title: string
  description?: string
  keywords?: string[]
  version: string
  href: string
  score: number
}
