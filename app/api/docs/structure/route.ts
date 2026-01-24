import { generateNavigation } from "@/lib/docs"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const version = searchParams.get("version") || "v1"

  try {
    const nav = await generateNavigation(version)
    return NextResponse.json({ nav, version })
  } catch (error) {
    console.error("Error generating navigation:", error)
    return NextResponse.json({ nav: [], version, error: "Failed to generate navigation" }, { status: 500 })
  }
}
