import Link from "next/link";
import Image from "next/image";
import { formatDate, getBrief } from "@/lib/utils";

type Post = {
  slug: string;
  meta: {
    title: string;
    subtitle?: string;
    date?: string;
    readtime?: string | number;
  };
  content: string;
  thumbnail?: string | null;
};

export function PostListItem({ post }: { post: Post }) {
  return (
    <Link href={`/${post.slug}`} className="block py-7 no-underline first:pt-0">
      <article className="flex gap-6">
        {post.thumbnail && (
          <div className="relative hidden w-60 shrink-0 overflow-hidden rounded-lg sm:block">
            <Image
              src={post.thumbnail}
              alt={post.meta.title}
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-foreground">
            {post.meta.title}
          </h3>

          {post.meta.subtitle && (
            <p className="mt-1.5 text-base text-zinc-400">
              {post.meta.subtitle}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            {post.meta.date && <span>{formatDate(post.meta.date)}</span>}
            {post.meta.readtime && <span>· {post.meta.readtime} read</span>}
          </div>

          <p className="mt-3 text-base leading-7 text-zinc-400">
            {getBrief(post.content)}
          </p>
        </div>
      </article>
    </Link>
  );
}
