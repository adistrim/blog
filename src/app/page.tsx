import { getAllSlugs, getPost, getThumbnail } from "@/lib/posts";
import { getPostDateValue } from "@/lib/utils";
import { ProfileHeader } from "@/components/blog/profile-header";
import { PostListItem } from "@/components/blog/post-list-item";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  const posts = getAllSlugs()
    .map((slug) => ({
      ...getPost(slug),
      thumbnail: getThumbnail(slug),
    }))
    .sort((a, b) => getPostDateValue(b.meta.date) - getPostDateValue(a.meta.date));

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 pb-8">
        <main id="main-content" className="flex-1 pb-8 pt-12">
          <ProfileHeader />

          <section className="mt-14">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Latest articles
            </h2>
            <div className="flex flex-col divide-y divide-white/10">
              {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
