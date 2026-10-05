import { Link } from "@/i18n/navigation";

interface AuthorCardProps {
  authorName: string;
}

export function AuthorCard({ authorName }: AuthorCardProps) {
  const initials = authorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-2xl bg-neutral-950 p-6 text-white">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-lg font-bold"
        >
          {initials}
        </span>
        <div>
          <p className="font-bold">{authorName}</p>
          <p className="text-sm text-neutral-400">Expert en rénovation depuis 2006</p>
        </div>
      </div>
      <p className="mt-5 text-sm text-neutral-300">
        Une question sur votre projet ? Visite et devis gratuits, rappel sous 24 h ouvrées.
      </p>
      <Link
        href="/#contact"
        className="mt-5 flex w-full items-center justify-center rounded-md bg-sky-400 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-sky-300 active:scale-[0.98]"
      >
        Demander un devis
      </Link>
    </div>
  );
}
