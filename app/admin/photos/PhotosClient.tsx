"use client";

import { useEffect, useState } from "react";
import { Download, AlertTriangle, ExternalLink } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient, endpoints, API_URL } from "@/lib/api";
import { ALL_SITE_IMAGES } from "@/lib/site-images";
import type { BeforeAfter, Portfolio } from "@/types/api";

/** Uploaded files may be stored as "/uploads/…" on the API server. */
const resolve = (url: string) => (url.startsWith("/") ? `${API_URL}${url}` : url);
const fileName = (url: string) => url.split("/").pop()?.split("?")[0] ?? "photo.jpg";

interface UploadedPhoto {
  key: string;
  src: string;
  title: string;
  where: string;
}

function PhotosContent() {
  const [uploaded, setUploaded] = useState<UploadedPhoto[] | null>(null);

  useEffect(() => {
    Promise.allSettled([apiClient.get(endpoints.portfolio.getAll), apiClient.get(endpoints.beforeAfter.getAll)]).then(
      ([p, ba]) => {
        const list: UploadedPhoto[] = [];
        if (p.status === "fulfilled")
          for (const item of p.value as Portfolio[])
            list.push({ key: `p${item.id}`, src: resolve(item.imageUrl), title: item.title, where: "Portfolio" });
        if (ba.status === "fulfilled")
          for (const item of ba.value as BeforeAfter[]) {
            list.push({ key: `b${item.id}`, src: resolve(item.beforeImageUrl), title: item.title, where: "Avant / Après — avant" });
            list.push({ key: `a${item.id}`, src: resolve(item.afterImageUrl), title: item.title, where: "Avant / Après — après" });
          }
        setUploaded(list);
      },
    );
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Photos du site</h1>
        <p className="mt-2 text-gray-600">
          Toutes les photos affichées sur le site, où elles apparaissent et comment elles peuvent être utilisées.
        </p>
      </div>

      <h2 className="mb-4 text-xl font-bold text-gray-900">Photos intégrées au site ({ALL_SITE_IMAGES.length})</h2>
      <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ALL_SITE_IMAGES.map((img) => (
          <Card key={img.src} className={`overflow-hidden ${img.restriction ? "ring-2 ring-amber-400" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.title} className="h-48 w-full object-cover" loading="lazy" />
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900">
                  <span className="mr-2 rounded bg-gray-900 px-1.5 py-0.5 text-xs text-white">{img.n}</span>
                  {img.title}
                </p>
                <a
                  href={img.src}
                  download={fileName(img.src)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-3.5 w-3.5" /> Télécharger
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Utilisée sur</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                  {img.usedOn.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </div>
              {img.restriction && (
                <p className="flex gap-2 rounded-md bg-amber-50 p-2 text-xs font-medium text-amber-900">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {img.restriction}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Source : {img.source}
                {img.unsplashId && (
                  <>
                    {" "}·{" "}
                    <a
                      href={`https://images.unsplash.com/photo-${img.unsplashId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 underline"
                    >
                      original <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}
                <br />
                {img.license}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-1 text-xl font-bold text-gray-900">Photos ajoutées depuis l&apos;administration</h2>
      <p className="mb-4 text-sm text-gray-500">Vos propres photos de chantiers (menus Portfolio et Avant / Après).</p>
      {uploaded === null ? (
        <p className="text-sm text-gray-400">Chargement…</p>
      ) : uploaded.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
          Aucune photo pour l&apos;instant. Ajoutez vos chantiers dans <strong>Portfolio</strong> ou <strong>Avant / Après</strong>.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {uploaded.map((u) => (
            <Card key={u.key} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.src} alt={u.title} className="h-36 w-full object-cover" loading="lazy" />
              <CardContent className="flex items-start justify-between gap-2 pt-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{u.title}</p>
                  <p className="text-xs text-gray-500">{u.where}</p>
                </div>
                <a href={u.src} download={fileName(u.src)} target="_blank" rel="noopener noreferrer" aria-label="Télécharger" className="rounded-md border p-1.5 text-gray-600 hover:bg-gray-50">
                  <Download className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PhotosClient() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <PhotosContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
