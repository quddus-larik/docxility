import { indexAllDocs } from "@/lib/search-index"

export async function GET(request: Request) {
  try {
    const docs = await indexAllDocs()
    return Response.json(
      { docs },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("Search indexing error:", error)
    return Response.json({ error: "Failed to index documents" }, { status: 500 })
  }
}
