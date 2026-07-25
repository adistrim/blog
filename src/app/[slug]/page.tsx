import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPost } from "@/lib/posts";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getAllSlugs().includes(slug)) notFound();

  const { meta, content } = getPost(slug);

  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        {/* Post header */}
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-bold leading-tight tracking-tight text-foreground">
            {meta.title}
          </h1>

          {meta.subtitle && (
            <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
              {meta.subtitle}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {meta.date && (
              <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <time>{formatDate(meta.date)}</time>
                </span>
            )}
            {meta.date && meta.readtime && <span>·</span>}
            {meta.readtime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {meta.readtime} read
              </span>
            )}
          </div>
        </div>

        <hr className="mb-10 border-border" />

        <article>
          <MarkdownRenderer content={content} />
        </article>

        <div className="mt-20 border-t border-border pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </main>
    </div>
  );
}
