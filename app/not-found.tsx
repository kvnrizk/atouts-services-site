import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-primary/20">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-4">
          Oups ! Page introuvable
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/">
          <Button size="lg" className="gradient-primary text-white">
            <Home className="h-5 w-5 mr-2" />
            Retour à l&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
