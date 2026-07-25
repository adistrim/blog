import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { codeToHtml } from "shiki";

function CodeBlock({
  language,
  highlightedHtml,
}: {
  language: string;
  highlightedHtml: string;
}) {
  return (
    <div className="my-4 rounded-lg overflow-hidden">
      <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
      </div>
      <div
        className="[&>pre]:m-0 [&>pre]:rounded-none [&>pre]:text-sm [&>pre]:p-4 [&>pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}

/**
 * Parses the markdown AST to find all fenced code blocks and pre-highlights
 * them with Shiki in parallel, returning a map keyed by `lang\x00code`.
 */
async function buildHighlightMap(
  content: string,
): Promise<Map<string, string>> {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
  const map = new Map<string, string>();
  const tasks: Promise<void>[] = [];

  visit(tree, "code", (node: { lang?: string | null; value: string }) => {
    const lang = node.lang || "text";
    const key = `${lang}\x00${node.value}`;
    if (!map.has(key)) {
      map.set(key, "");
      tasks.push(
        codeToHtml(node.value, {
          lang,
          theme: "one-dark-pro",
          transformers: [
            {
              pre(el) {
                el.properties.style = (el.properties.style as string)?.replace(
                  /border-radius:[^;]+;?/,
                  "",
                );
              },
            },
          ],
        }).then((html) => {
          map.set(key, html);
        }),
      );
    }
  });

  await Promise.all(tasks);
  return map;
}

export async function MarkdownRenderer({ content }: { content: string }) {
  const highlightMap = await buildHighlightMap(content);

  const components: Components = {
    h1({ children }) {
      return (
        <h1 className="text-3xl font-bold mt-10 mb-5 pb-2 border-b border-border first:mt-0">
          {children}
        </h1>
      );
    },

    h2({ children }) {
      return (
        <h2 className="text-2xl font-semibold mt-10 mb-4 pb-1 border-b border-border/50 first:mt-0">
          {children}
        </h2>
      );
    },

    h3({ children }) {
      return (
        <h3 className="text-xl font-semibold mt-8 mb-3 first:mt-0">
          {children}
        </h3>
      );
    },

    h4({ children }) {
      return (
        <h4 className="text-lg font-semibold mt-6 mb-2 first:mt-0">
          {children}
        </h4>
      );
    },

    p({ children }) {
      return (
        <p className="my-5 text-lg leading-8 text-foreground/90 first:mt-0 last:mb-0">
          {children}
        </p>
      );
    },

    ul({ children }) {
      return (
        <ul className="my-5 ml-7 list-disc space-y-2 marker:text-muted-foreground">
          {children}
        </ul>
      );
    },

    ol({ children }) {
      return (
        <ol className="my-5 ml-7 list-decimal space-y-2 marker:text-muted-foreground marker:font-medium">
          {children}
        </ol>
      );
    },

    li({ children }) {
      return <li className="text-lg leading-8 pl-1 text-foreground/90">{children}</li>;
    },

    blockquote({ children }) {
      return (
        <blockquote className="my-6 border-l-4 border-primary/60 bg-muted/30 pl-5 py-3 pr-4 italic text-muted-foreground rounded-r-md text-lg leading-8">
          {children}
        </blockquote>
      );
    },

    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeContent = String(children).replace(/\n$/, "");
      const isCodeBlock = match || codeContent.includes("\n");

      if (isCodeBlock) {
        const lang = match?.[1] || "text";
        return (
          <CodeBlock
            language={lang}
            highlightedHtml={
              highlightMap.get(`${lang}\x00${codeContent}`) ?? ""
            }
          />
        );
      }

      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary/90 border border-border/50">
          {children}
        </code>
      );
    },

    pre({ children }) {
      return <>{children}</>;
    },

    img({ src, alt }) {
      // Hashnode exports images with trailing attributes in the URL, e.g.:
      // ![](/path/img.png align="center")
      // Strip everything after the first whitespace to get the clean src.
      const srcStr = typeof src === "string" ? src : "";
      const cleanSrc = srcStr.split(/\s+/)[0] ?? "";
      const centered = srcStr.includes('align="center"');

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cleanSrc}
          alt={alt ?? ""}
          className={`my-8 max-w-full rounded-lg ${
            centered ? "mx-auto block" : ""
          }`}
        />
      );
    },

    table({ children }) {
      return (
        <div className="my-4 overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            {children}
          </table>
        </div>
      );
    },

    thead({ children }) {
      return <thead className="bg-muted/50">{children}</thead>;
    },

    tbody({ children }) {
      return (
        <tbody className="divide-y divide-border bg-card">{children}</tbody>
      );
    },

    tr({ children }) {
      return (
        <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
      );
    },

    th({ children }) {
      return (
        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
          {children}
        </th>
      );
    },

    td({ children }) {
      return (
        <td className="px-4 py-3 text-sm text-muted-foreground">{children}</td>
      );
    },

    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {children}
        </a>
      );
    },

    strong({ children }) {
      return (
        <strong className="font-semibold text-foreground">{children}</strong>
      );
    },

    em({ children }) {
      return <em className="italic">{children}</em>;
    },

    hr() {
      return <hr className="my-6 border-t border-border" />;
    },
  };

  return (
    <div className="prose-container text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
