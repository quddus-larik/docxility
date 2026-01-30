import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx-components";

interface AppMDXProviderProps {
  source: string;
}

export function AppMDXProvider({ source }: AppMDXProviderProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: "github-light",
                keepBackground: false,
              },
            ],
          ],
        },
      }}
    />
  );
}
