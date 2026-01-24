import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx-components"

export function AppMDXProvider({ source }: any) {
  return <MDXRemote source={source} components={mdxComponents} />
}
