import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(raw: string): string {
  const [day, month, year] = raw.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getPostDateValue(date?: string): number {
  if (!date) return 0;
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function getBrief(content: string, maxLength = 200): string {
  const paragraphs = content
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => !paragraph.startsWith("#"));

  const firstParagraph = paragraphs[0] ?? content.replace(/\s+/g, " ").trim();
  const cleaned = firstParagraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return truncateText(cleaned, maxLength);
}

// Strip basic markdown syntax for a plain-text excerpt fallback.
export function makeBrief(content: string, maxLen = 120): string {
  const plain = content
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links -> text
    .replace(/[#*_`>~-]/g, "") // md symbols
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLen ? plain.slice(0, maxLen).trim() + "…" : plain;
}

// Pulls a leading integer out of strings like "5 min read". Returns 0 if none found.
export function parseReadTime(readtime?: string): number {
  if (!readtime) return 0;
  const match = readtime.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
