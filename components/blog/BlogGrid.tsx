"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogCardData } from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * Article grid with category filters. Every card is rendered on the server (good for SEO);
 * the filter only hides cards on the client.
 */
export function BlogGrid({ posts }: { posts: BlogCardData[] }) {
  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => !!c))),
    [posts],
  );
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? posts.filter((p) => p.category === active) : posts;

  const pill = (selected: boolean) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.97]",
      selected ? "bg-neutral-950 text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:ring-neutral-400",
    );

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrer par thème">
          <button type="button" className={pill(active === null)} aria-pressed={active === null} onClick={() => setActive(null)}>
            Tous les articles
          </button>
          {categories.map((c) => (
            <button key={c} type="button" className={pill(active === c)} aria-pressed={active === c} onClick={() => setActive(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
