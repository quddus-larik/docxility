"use client";

import { useState, useEffect, useRef } from "react";
import type { DocNavItem } from "@/types/types";

// Module-level cache - persists across component re-renders
const versionsCache = { data: null as string[] | null };
const navCache = new Map<string, DocNavItem[]>();

export function useDocSidebar(version: string, currentPath: string) {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<DocNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState<string[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(true);
  const loadedVersionRef = useRef<string | null>(null);

  // Fetch docs versions once
  useEffect(() => {
    if (versionsCache.data !== null) {
      setVersions(versionsCache.data);
      setLoadingVersions(false);
      return;
    }

    const fetchVersions = async () => {
      try {
        const res = await fetch("/api/docs/versions");
        const data = await res.json();
        versionsCache.data = data.versions || [];
        setVersions(versionsCache.data as any);
      } catch (err) {
        console.error("Failed to fetch versions:", err);
      } finally {
        setLoadingVersions(false);
      }
    };
    fetchVersions();
  }, []);

  // Fetch navigation items - cached per version, no reload on page nav
  useEffect(() => {
    // If already loaded for this version, use cached data immediately
    if (loadedVersionRef.current === version && navCache.has(version)) {
      setItems(navCache.get(version) || []);
      setLoading(false);
      return;
    }

    // Only show loading when switching versions
    if (loadedVersionRef.current !== version) {
      setLoading(true);
    }

    const fetchNavigation = async () => {
      try {
        // Check cache first
        if (navCache.has(version)) {
          const cachedNav = navCache.get(version) || [];
          setItems(cachedNav);
        } else {
          const res = await fetch(`/api/docs/structure?version=${version}`);
          const data = await res.json();
          const nav = data.nav || [];
          navCache.set(version, nav);
          setItems(nav);
        }
        loadedVersionRef.current = version;
      } catch (err) {
        console.error("Failed to fetch navigation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNavigation();
  }, [version]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const normalize = (p: string) => p.replace(/\/+$/, "");
  const isActive = (href?: string) => {
    if (!href) return false;
    return (
      normalize(currentPath) === normalize(href) ||
      normalize(currentPath).startsWith(normalize(href) + "/")
    );
  };

  const shouldExpand = (item: DocNavItem): boolean => {
    if (isActive(item.href)) return true;
    if (item.items) return item.items.some((child) => shouldExpand(child));
    return false;
  };

  const getItemId = (item: DocNavItem) => item.href ?? `folder:${item.title}`;

  return {
    open,
    setOpen,
    expandedItems,
    toggleExpanded,
    items,
    loading,
    versions,
    loadingVersions,
    isActive,
    shouldExpand,
    getItemId,
  };
}
