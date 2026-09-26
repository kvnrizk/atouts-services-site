import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPostDate, type BlogCardData } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Article card: "grid" in the listing, "featured" for the latest post, "compact" in the article sidebar. */
export function BlogCard({ post, variant = "grid" }: { post: BlogCardData; variant?: "grid" | "featured" | "compact" }) {
  const meta = [formatPostDate(post.publishedAt), `${post.minutes} min de lecture`].filter(Boolean).join(" · ");

  if (variant === "compact") {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex gap-4">
        {post.coverImageUrl && (
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            <Image src={post.coverImageUrl} alt="" fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-950 transition-colors group-hover:text-sky-700">{post.title}</p>
          <p className="mt-1 text-xs text-neutral-500">{meta}</p>
        </div>
      </Link>
    );
  }

  const featured = variant === "featured";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-sky-200",
        featured && "md:grid md:grid-cols-2",
      )}
    >
      <div className={cn("relative overflow-hidden bg-neutral-100", featured ? "aspect-[16/10] md:aspect-auto md:min-h-[360px]" : "aspect-[16/10]")}>
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-6", featured && "md:justify-center md:p-10")}>
        {post.category && (
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">{post.category}</p>
        )}
        <h2
          className={cn(
            "mt-2 font-bold leading-snug tracking-tight text-neutral-950 [text-wrap:balance]",
            featured ? "text-2xl md:text-4xl" : "text-xl",
          )}
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p className={cn("mt-3 text-neutral-600", featured ? "md:text-lg" : "line-clamp-3 text-sm")}>{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
          <span className="text-neutral-500">{meta}</span>
          <span className="inline-flex shrink-0 items-center font-semibold text-neutral-950">
            Lire
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
