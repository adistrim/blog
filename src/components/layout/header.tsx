import Link from "next/link";
import { Terminal } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
          <Terminal className="h-5 w-5" />
          {SITE_NAME}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
