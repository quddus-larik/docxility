import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Comprehensive documentation",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
