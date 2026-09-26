"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { projectTypeLabel as categoryLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** One card of the réalisations page: a before/after project (has a detail page) or a portfolio photo. */
export type RealisationItem =
  | { kind: "beforeAfter"; id: number; title: string; description?: string; category?: string; beforeImageUrl: string; afterImageUrl: string }
  | { kind: "photo"; id: number; title: string; description?: string; category?: string; imageUrl: string };

const tag = "absolute left-3 top-3 rounded-md bg-neutral-950/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur";

function Card({ item }: { item: RealisationItem }) {
  const label = categoryLabel(item.category);
  const body = (
    <>
      {item.kind === "beforeAfter" ? (
        <div className="grid grid-cols-2 gap-px bg-neutral-200">
          {[
            { src: item.beforeImageUrl, text: "Avant" },
            { src: item.afterImageUrl, text: "Après" },
          ].map((img) => (
            <div key={img.text} className="relative aspect-[4/5] overflow-hidden">
              <Image src={img.src} alt={`${item.title} — ${img.text.toLowerCase()}`} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className={tag}>{img.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative aspect-[8/5] overflow-hidden">
          <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {label && <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">{label}</p>}
        <h3 className="mt-2 text-lg font-bold leading-snug text-neutral-950">{item.title}</h3>
        {item.description && <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{item.description}</p>}
        {item.kind === "beforeAfter" && (
          <span className="mt-auto inline-flex items-center pt-5 text-sm font-semibold text-neutral-950">
            Voir le projet <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </>
  );
  const cardClass = "group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition duration-300";
  return item.kind === "beforeAfter" ? (
    <Link href={`/realisations/${item.id}`} className={cn(cardClass, "hover:-translate-y-1 hover:shadow-lg hover:ring-sky-200")}>
      {body}
    </Link>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}

export function RealisationsGrid({ items }: { items: RealisationItem[] }) {
  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter((c): c is string => !!c))),
    [items],
  );
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? items.filter((i) => i.category === active) : items;

  const pill = (selected: boolean) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.97]",
      selected ? "bg-neutral-950 text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:ring-neutral-400",
    );

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrer par type de travaux">
          <button type="button" className={pill(active === null)} aria-pressed={active === null} onClick={() => setActive(null)}>
            Tous les chantiers
          </button>
          {categories.map((c) => (
            <button key={c} type="button" className={pill(active === c)} aria-pressed={active === c} onClick={() => setActive(c)}>
              {categoryLabel(c)}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <Card key={`${item.kind}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}
