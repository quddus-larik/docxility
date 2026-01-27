// types/registry.ts
import { XMeta } from "@/x-meta.config";

export type ComponentRegistry = typeof XMeta.interface.components;
export type ComponentName = keyof ComponentRegistry;

// Extract props for a specific component automatically
export type ComponentProps<T extends ComponentName> = 
  React.ComponentProps<ComponentRegistry[T]>;