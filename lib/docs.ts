import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkHtml from "remark-html"
import type { DocFile, DocMeta, DocHeading, DocNavItem } from "@/types/types"
import { XMeta } from "@/x-meta.config"

const DOCS_DIR = path.join(process.cwd(), XMeta.documentsPath)

function isHidden(name: string): boolean {
  return name.includes(".hidden")
}

// Extract headings from markdown
function extractHeadings(content: string): DocHeading[] {
  const headingRegex = /^#{2,4}\s+(.+)$/gm
  const headings: DocHeading[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1]
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    const level = match[0].indexOf(" ") // Count # characters
    headings.push({ level, text, id })
  }

  return headings
}

// Parse markdown file and extract metadata + content
async function parseDocFile(filePath: string): Promise<Partial<DocFile>> {
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(fileContent)

  // Convert markdown to HTML
  const processedContent = await remark().use(remarkHtml).process(content)

  const htmlContent = String(processedContent)
  const headings = extractHeadings(content)

  return {
    content: htmlContent,
    headings,
    metadata: data as DocMeta,
  }
}

// Get all docs for a specific version
export async function getAllDocs(version: string): Promise<DocFile[]> {
  const versionDir = path.join(DOCS_DIR, version)

  if (!fs.existsSync(versionDir)) {
    return []
  }

  const docs: DocFile[] = []

  function walkDir(dir: string, slug: string[] = []) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      if (isHidden(file)) return

      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath, [...slug, file])
      } else if (file.endsWith(".mdx") || file.endsWith(".md")) {
        const fileSlug = file.replace(/\.(mdx?|md)$/, "")
        if (fileSlug !== "main") {
          docs.push({
            slug: [...slug, fileSlug],
            path: filePath,
            title: fileSlug,
            content: "",
            rawContent: "",
            headings: [],
          })
        }
      }
    })
  }

  walkDir(versionDir)
  return docs
}

// Get a specific doc file
export async function getDoc(version: string, slug: string[]): Promise<DocFile | null> {
  const fileName = slug[slug.length - 1]
  const dirPath = slug.slice(0, -1).length
    ? path.join(DOCS_DIR, version, ...slug.slice(0, -1))
    : path.join(DOCS_DIR, version)

  const filePath = path.join(dirPath, `${fileName}.mdx`)
  const fallbackPath = path.join(dirPath, `${fileName}.md`)
  const indexPath = path.join(dirPath, fileName, "main.mdx")
  const indexFallbackPath = path.join(dirPath, fileName, "main.md")

  let file: string | null = null

  if (fs.existsSync(filePath)) {
    file = filePath
  } else if (fs.existsSync(fallbackPath)) {
    file = fallbackPath
  } else if (fs.existsSync(indexPath)) {
    file = indexPath
  } else if (fs.existsSync(indexFallbackPath)) {
    file = indexFallbackPath
  }

  if (!file) return null

  // Read raw content
  const fileContent = fs.readFileSync(file, "utf-8")
  const { data, content } = matter(fileContent)

  // Parse for headings if needed
  const parsed = await parseDocFile(file)

  return {
    slug,
    path: file,
    title: data?.title || slug[slug.length - 1],
    description: data?.description,
    content: parsed.content || "",      // HTML or serialized if you use remark-html
    rawContent: content,                // RAW MDX/Markdown for manual serialization
    headings: parsed.headings || []
  }
}

// Generate navigation structure from file system
function slugify(name: string) {
  return name
    .toLowerCase()           // lowercase
    .replace(/\s+/g, "-")    // spaces → hyphens
    .replace(/[^\w-]/g, "")  // remove non-word chars
}

export async function generateNavigation(version: string): Promise<DocNavItem[]> {
  const versionDir = path.join(DOCS_DIR, version)
  if (!fs.existsSync(versionDir)) return []

  function processDir(
    dir: string,
    parentSlugs: string[] = []
  ): DocNavItem[] {
    const entries = fs.readdirSync(dir).sort()
    const items: DocNavItem[] = []

    const metaMap = new Map<
      string,
      {
        title: string
        order: number
        isDir: boolean
        hasMainFile: boolean
      }
    >()

    for (const entry of entries) {
      if (entry.startsWith(".") || isHidden(entry)) continue

      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)

      /* ------------------ DIRECTORY ------------------ */
      if (stat.isDirectory()) {
        if (!hasValidMarkdownFiles(fullPath)) continue

        const mainMdx = path.join(fullPath, "main.mdx")
        const mainMd = path.join(fullPath, "main.md")
        const hasMainFile = fs.existsSync(mainMdx) || fs.existsSync(mainMd)

        let title = entry
        let order = 999

        if (hasMainFile) {
          const mainFile = fs.existsSync(mainMdx) ? mainMdx : mainMd
          try {
            const { data } = matter(fs.readFileSync(mainFile, "utf-8"))
            title = data.title || title
            order = data.order ?? order
          } catch {}
        }

        metaMap.set(entry, {
          title,
          order,
          isDir: true,
          hasMainFile,
        })
      }

      /* ------------------ FILE ------------------ */
      else if (entry.endsWith(".md") || entry.endsWith(".mdx")) {
        const name = entry.replace(/\.(mdx|md)$/, "")
        if (name === "main" || name === "index") continue

        let title = name
        let order = 999

        try {
          const { data } = matter(fs.readFileSync(fullPath, "utf-8"))
          title = data.title || title
          order = data.order ?? order
        } catch {}

        metaMap.set(name, {
          title,
          order,
          isDir: false,
          hasMainFile: false,
        })
      }
    }

    const sorted = [...metaMap.entries()].sort(
      (a, b) => a[1].order - b[1].order
    )

    for (const [name, meta] of sorted) {
      const slug = slugify(name)
      const hrefPath = [...parentSlugs, slug].join("/")

      /* ------------------ DIRECTORY ITEM ------------------ */
      if (meta.isDir) {
        const childDir = path.join(dir, name)
        const children = processDir(childDir, [...parentSlugs, slug])

        if (!children.length) continue

        items.push({
          title: meta.title,
          href: meta.hasMainFile
            ? `/docs/${version}/${hrefPath}`
            : undefined,
          items: children,
          hasMainFile: meta.hasMainFile,
        })
      }

      /* ------------------ FILE ITEM ------------------ */
      else {
        items.push({
          title: meta.title,
          href: `/docs/${version}/${hrefPath}`,
        })
      }
    }

    return items
  }

  return processDir(versionDir)
}


// Get available versions
export function getVersions(): string[] {
  if (!fs.existsSync(DOCS_DIR)) {
    return []
  }

  return fs
    .readdirSync(DOCS_DIR)
    .filter((file) => {
      if (isHidden(file)) return false

      const stat = fs.statSync(path.join(DOCS_DIR, file))
      return stat.isDirectory()
    })
    .sort()
}

function hasValidMarkdownFiles(dir: string): boolean {
  const files = fs.readdirSync(dir)
  return files.some((file) => {
    if (isHidden(file) || file.startsWith(".")) return false
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      return hasValidMarkdownFiles(filePath)
    }
    return file.endsWith(".mdx") || file.endsWith(".md")
  })
}
