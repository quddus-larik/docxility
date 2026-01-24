import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { SearchableDoc } from "@/types/types"
import { XMeta } from "@/x-meta.config"

const DOCS_DIR = path.join(process.cwd(), XMeta.documentsPath)

function isHidden(name: string): boolean {
  return name.includes(".hidden")
}

function extractPlainText(htmlContent: string): string {
  return htmlContent
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim()
}

export async function indexAllDocs(): Promise<SearchableDoc[]> {
  const docs: SearchableDoc[] = []

  function walkDir(dir: string, version: string, slug: string[] = []) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      if (file.startsWith(".") || isHidden(file)) return

      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath, version, [...slug, file])
      } else if (file.endsWith(".mdx") || file.endsWith(".md")) {
        const fileSlug = file.replace(/\.(mdx?|md)$/, "")

        // Skip main/index files, they're folder entry points
        if (fileSlug === "main" || fileSlug === "index") return

        try {
          const fileContent = fs.readFileSync(filePath, "utf-8")
          const { data, content } = matter(fileContent)

          // Extract plain text from content
          const plainContent = extractPlainText(content)

          docs.push({
            id: `${version}-${[...slug, fileSlug].join("/")}`,
            title: data.title || fileSlug.replace(/-/g, " "),
            description: data.description,
            keywords: data.keywords || [],
            content: plainContent,
            version,
            href: `/docs/${version}/${[...slug, fileSlug].join("/")}`,
          })
        } catch (error) {
          console.error(`Error indexing ${filePath}:`, error)
        }
      }
    })
  }

  // Get all versions
  if (!fs.existsSync(DOCS_DIR)) {
    return docs
  }

  const versions = fs.readdirSync(DOCS_DIR).filter((file) => {
    if (isHidden(file)) return false
    const stat = fs.statSync(path.join(DOCS_DIR, file))
    return stat.isDirectory()
  })

  versions.forEach((version) => {
    const versionDir = path.join(DOCS_DIR, version)
    walkDir(versionDir, version)
  })

  console.log(`Indexed ${docs.length} documents`)
  return docs
}
