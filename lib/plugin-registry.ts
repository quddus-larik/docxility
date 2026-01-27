// lib/registry.ts
import { XMeta } from "@/x-meta.config";
import { ComponentName, ComponentRegistry } from "@/types/registry";

export function getPlugin<T extends ComponentName>(name: T): ComponentRegistry[T] {
  const component = XMeta.interface.components[name];
  
  if (!component) {
    throw new Error(`Component ${name} not found in XMeta registry`);
  }

  return component;
}