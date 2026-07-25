import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");
const publicDirectory = path.join(process.cwd(), "public");

const IMAGE_EXTENSIONS = ["webp", "jpg", "jpeg", "png", "avif", "gif"];

export interface PostMeta {
  title: string;
  subtitle?: string;
  date?: string;
  readtime?: string;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
}

function parseFrontmatter(raw: string): { meta: PostMeta; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { meta: { title: "" }, content: raw };
  }

  const kvPairs: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    kvPairs[key] = value;
  }

  return {
    meta: {
      title: kvPairs.title ?? "",
      subtitle: kvPairs.subtitle,
      date: kvPairs.date,
      readtime: kvPairs.readtime,
    },
    content: match[2],
  };
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(postsDirectory);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Returns the public-root URL of the thumbnail (e.g. "/my-post.webp"), or null. */
export function getThumbnail(slug: string): string | null {
  const slugDirectory = path.join(publicDirectory, slug);
  if (fs.existsSync(slugDirectory) && fs.statSync(slugDirectory).isDirectory()) {
    for (const file of fs.readdirSync(slugDirectory)) {
      const dotIdx = file.lastIndexOf(".");
      if (dotIdx === -1) continue;
      const name = file.slice(0, dotIdx);
      const ext = file.slice(dotIdx + 1).toLowerCase();
      if (name === "thumbnail" && IMAGE_EXTENSIONS.includes(ext)) {
        return `/${slug}/${file}`;
      }
    }
  }

  const files = fs.readdirSync(publicDirectory);
  for (const file of files) {
    const dotIdx = file.lastIndexOf(".");
    if (dotIdx === -1) continue;
    const name = file.slice(0, dotIdx);
    const ext = file.slice(dotIdx + 1).toLowerCase();
    if (name === slug && IMAGE_EXTENSIONS.includes(ext)) {
      return `/${file}`;
    }
  }
  return null;
}

export function getPost(slug: string): Post {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { meta, content } = parseFrontmatter(raw);
  return { slug, meta, content };
}
