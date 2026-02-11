"use client";

import type { DocHeading } from "@/types/types";
import { useDocTOC } from "@/hooks/useTOC";
import { TocItem } from "@/hooks/useTOC";

import { cn } from "@/lib/utils";
import type { DocTOCStyles } from "@/types/interface";

interface DocTOCProps {
  headings: DocHeading[];
  styles?: DocTOCStyles;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const defaultStyles: DocTOCStyles = {
  container: "fixed right-4 top-20 hidden w-64 xl:block h-[calc(100vh-5rem)] overflow-y-auto",
  nav: "space-y-2",
  title: "text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-4",
  item: "block w-full rounded px-3 py-1 text-left text-sm transition-colors text-foreground/60 hover:text-foreground",
  itemActive: "bg-primary/10 text-primary font-bold",
};

export function DocTOC({ 
  headings,
  styles = {},
  header,
  footer,
}: DocTOCProps) {
  const { activeId, hierarchy, scrollToHeading } = useDocTOC(headings);
  const s = { ...defaultStyles, ...styles };

  if (!headings.length) return null;

  const renderItems = (items: TocItem[], depth = 0) => (
    <ul className="flex flex-col gap-1 list-none p-0 m-0">
      {items.map((item) => (
        <li key={item.heading.id} className="list-none">
          <button
            type="button"
            onClick={() => scrollToHeading(item.heading.id)}
            className={cn(
              "w-full rounded text-left transition-colors border-0 cursor-pointer bg-transparent",
              s.item,
              activeId === item.heading.id && s.itemActive
            )}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            {item.heading.text}
          </button>
          {item.children.length > 0 && renderItems(item.children, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <aside className={cn("overflow-y-auto", s.container)}>
      {header}
      <nav className={cn("flex flex-col", s.nav)}>
        <h3 className={cn("m-0", s.title)}>On This Page</h3>
        {renderItems(hierarchy)}
      </nav>
      {footer}
    </aside>
  );
}
