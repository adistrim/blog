import Link from "next/link";
import { AUTHOR_NAME, AUTHOR_BIO, SOCIAL_LINKS } from "@/lib/constants";

export function ProfileHeader() {
  return (
    <section className="flex flex-col items-center text-center gap-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {AUTHOR_NAME}
      </h1>

      <p className="max-w-xl text-base leading-7 text-zinc-400">
        {AUTHOR_BIO}
      </p>

      <div className="flex items-center gap-6 text-zinc-400">
        {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="transition-colors hover:text-foreground"
          >
            <Icon className="h-5 w-5" />
          </Link>
        ))}
      </div>
    </section>
  );
}

