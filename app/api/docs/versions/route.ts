import { readdirSync } from "fs"
import { join } from "path"
import { NextResponse } from "next/server"
import { XMeta } from "@/x-meta.config"

export async function GET() {
  try {
    const docsPath = join(process.cwd(), XMeta.documentsPath)
    const entries = readdirSync(docsPath, { withFileTypes: true })

    const versions = entries
      .filter((entry) => entry.isDirectory() && /^v\d+$/.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => {
        const numA = Number.parseInt(a.slice(1))
        const numB = Number.parseInt(b.slice(1))
        return numA - numB
      })

    return NextResponse.json({ versions })
  } catch (error) {
    console.error("Error fetching versions:", error)
    return NextResponse.json({ versions: [], error: "Failed to fetch versions" }, { status: 500 })
  }
}
