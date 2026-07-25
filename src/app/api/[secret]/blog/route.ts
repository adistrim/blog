import { NextRequest, NextResponse } from "next/server";
import { getAllSlugs, getPost, getThumbnail } from "@/lib/posts";
import { makeBrief, parseReadTime } from "@/lib/utils";
import { ENV } from "@/config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ secret: string }> }
) {
  const { secret } = await params;

  if (secret !== ENV.secret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== ENV.apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const countParam = req.nextUrl.searchParams.get("count");
  const count = countParam ? parseInt(countParam, 10) : 5;

  if (!ENV.siteUrl) {
    return NextResponse.json(
      { error: "Server misconfigured: SITE_URL not set" },
      { status: 500 }
    );
  }

  const slugs = getAllSlugs()
    .map((slug) => getPost(slug))
    .sort((a, b) => {
      const da = a.meta.date ? new Date(a.meta.date).getTime() : 0;
      const db = b.meta.date ? new Date(b.meta.date).getTime() : 0;
      return db - da;
    })
    .slice(0, count);

  const posts = slugs.map((post) => {
    const thumb = getThumbnail(post.slug);
    return {
      title: post.meta.title,
      subtitle: post.meta.subtitle ?? null,
      brief: makeBrief(post.content),
      url: `${ENV.siteUrl}/${post.slug}`,
      readTimeInMinutes: parseReadTime(post.meta.readtime),
      publishedAt: post.meta.date ?? null,
      coverImage: {
        url: thumb ? `${ENV.siteUrl}${thumb}` : null,
      },
    };
  });

  return NextResponse.json({
    publication: {
      posts: {
        edges: posts.map((node) => ({ node })),
      },
    },
  });
}
