import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
          {initials}
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{authorName}</h3>
        <p className="text-sm text-gray-600 mb-6">
          Expert en rénovation depuis 2015
        </p>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          asChild
        >
          <Link href="/#contact">Demander un devis</Link>
        </Button>
      </div>
    </div>
  );
}
