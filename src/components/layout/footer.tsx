import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AUTHOR_NAME, MAIN_SITE, MAIN_SITE_URL, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border pt-6 text-sm text-zinc-500">
      <div className="flex flex-col gap-4">
        <p>© {new Date().getFullYear()} {AUTHOR_NAME} ({SITE_NAME})</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/sitemap.xml" className="hover:text-zinc-200">Sitemap</Link>
          <Link href="/rss.xml" className="hover:text-zinc-200">RSS</Link>
          <Link
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 hover:text-zinc-200 underline"
          >
            {MAIN_SITE}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
