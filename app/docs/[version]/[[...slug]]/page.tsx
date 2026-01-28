import { generateNavigation } from "@/lib/docs";
import { getPlugin } from "@/lib/plugin-registry";

import { validateVersion, resolveDoc, getCurrentPath, getPagination } from "@/lib/doc-preview";
import { AppMDXProvider } from "@/lib/mdx-provider";
import { generateDocMetadata, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    version: string;
    slug?: string[];
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { version, slug = [] } = await props.params;

  if (slug.length === 0) {
    return {
      title: "Documentation",
      description: "Browse our comprehensive documentation",
    };
  }

  try {
    const doc = await resolveDoc(version, slug);
    if (doc) {
      return generateDocMetadata({
        title: doc.title,
        description: doc.description,
        slug,
        version,
      });
    }
  } catch {
    // Return default metadata if doc resolution fails
  }

  return {
    title: "Documentation",
    description: "Documentation page",
  };
}

export default async function DocsPage(props: PageProps) {
  const { version, slug = [] } = await props.params;

  validateVersion(version);

  const navigation = await generateNavigation(version);
  const doc = await resolveDoc(version, slug);

  const currentPath = getCurrentPath(version, slug);
  const { prev, next } = getPagination(
    navigation,
    currentPath,
  );

  const SidebarSlot = getPlugin("sidebar");
  const PaginationSlot = getPlugin("pagination");
  const TOCSlot = getPlugin("TOC");

  // Generate structured data
  const articleSchema = doc ? generateArticleSchema({
    title: doc.title,
    description: doc.description,
    slug,
    version,
  }) : null;

  const breadcrumbSchema = generateBreadcrumbSchema(version, slug);
  
  return (
    <>
      {/* Article Schema */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="h-svh overflow-hidden">
        <div className="flex overflow-hidden h-full">
          <SidebarSlot currentPath={currentPath} version={version} />
          <div className="flex-1 overflow-auto lg:ml-0">
            <div className="mx-auto lg:w-full px-4 py-8 lg:px-8 lg:py-12 lg:pr-96">
              {doc ? (
                <>
                  <article className="prose prose-sm dark:prose-invert max-w-none"  id="docs-scroll-container">
                    <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
                    {doc.description && (
                      <p className="text-muted-foreground text-lg mb-8">
                        {doc.description}
                      </p>
                    )}
                    {doc && <AppMDXProvider source={doc.rawContent as string} />}
                  </article>

                  {/* Pagination */}
                  <PaginationSlot
                    prevHref={prev?.href}
                    prevTitle={prev?.title}
                    nextHref={next?.href}
                    nextTitle={next?.title}
                  />

                  <TOCSlot headings={doc.headings} />
                </>
              ) : (
                <div className="py-12">
                  <h1 className="text-3xl font-bold mb-4">Documentation</h1>
                  <p className="text-muted-foreground mb-8">
                    Select a page from the sidebar to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
