"use client"
import { useEffect, useState } from "react"
import type { DocHeading } from "@/types/types"

interface DocTOCProps { headings: DocHeading[] }

interface TocItem { heading: DocHeading; level: number; children: TocItem[] }

export function DocTOC({ headings }: DocTOCProps) {
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const article = document.getElementById("docs-scroll-container")
    if (!article) return
    
    let container = article.parentElement
    while (container && !container.classList.contains("overflow-auto")) {
      container = container.parentElement
    }
    if (!container) return

    const handleScroll = () => {
      let active = ""
      const containerRect = container.getBoundingClientRect()
      for (const h of headings) {
        const el = document.getElementById(h.id)
        if (!el) continue
        const elRect = el.getBoundingClientRect()
        if (elRect.top - containerRect.top <= 120) active = h.id
        else break
      }
      setActiveId(active)
    }

    container.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => container.removeEventListener("scroll", handleScroll)
  }, [headings])

  if (!headings.length) return null

  const buildHierarchy = (headings: DocHeading[]): TocItem[] => {
    const roots: TocItem[] = []
    const stack: TocItem[] = []

    for (const heading of headings) {
      const item: TocItem = { heading, level: heading.level, children: [] }
      while (stack.length && stack[stack.length - 1].level >= heading.level) stack.pop()
      if (stack.length === 0) roots.push(item)
      else stack[stack.length - 1].children.push(item)
      stack.push(item)
    }

    return roots
  }

  const hierarchy = buildHierarchy(headings)

  const scrollToHeading = (id: string) => {
    const article = document.getElementById("docs-scroll-container")
    const target = document.getElementById(id)
    if (!article || !target) return
    
    let container = article.parentElement
    while (container && !container.classList.contains("overflow-auto")) {
      container = container.parentElement
    }
    if (!container) return
    
    const targetPosition = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
    container.scrollTo({ top: targetPosition - 80, behavior: "smooth" })
  }

  const renderItems = (items: TocItem[], depth = 0) => (
    <ul className="space-y-1">
      {items.map(item => (
        <li key={item.heading.id}>
          <button
            type="button"
            onClick={() => scrollToHeading(item.heading.id)}
            className={`block w-full rounded px-3 py-1 text-left text-sm transition-colors ${
              activeId === item.heading.id ? "bg-primary/10 text-primary font-bold" : "text-foreground/60 hover:text-foreground"
            }`}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            {item.heading.text}
          </button>
          {item.children.length > 0 && renderItems(item.children, depth + 1)}
        </li>
      ))}
    </ul>
  )

  return (
    <aside className="fixed right-4 top-20 hidden w-56 xl:block">
      <nav className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">On This Page</h3>
        {renderItems(hierarchy)}
      </nav>
    </aside>
  )
}
