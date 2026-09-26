"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, AlertTriangle, ImageUp, Pencil, RotateCcw } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient, endpoints, API_URL } from "@/lib/api";
import { SITE_IMAGES, type SiteImage } from "@/lib/site-images";
import { absoluteUpload, type SiteImageOverrides } from "@/lib/site-image-overrides";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import type { BeforeAfter, Portfolio } from "@/types/api";

/** Uploaded files may be stored as "/uploads/…" on the API server. */
const resolve = (url: string) => (url.startsWith("/") ? `${API_URL}${url}` : url);
const fileName = (url: string) => url.split("/").pop()?.split("?")[0] ?? "photo.jpg";

/** Built-in photos in registry order, with their key (used to store a replacement) */
const builtIn = Object.entries(SITE_IMAGES)
  .map(([key, img]) => ({ key, img: img as SiteImage }))
  .sort((a, b) => a.img.n - b.img.n);

interface UploadedPhoto {
  key: string;
  src: string;
  title: string;
  where: string;
}

function PhotosContent() {
  const [uploaded, setUploaded] = useState<UploadedPhoto[] | null>(null);
  const [overrides, setOverrides] = useState<SiteImageOverrides>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const { toast } = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    apiClient.get(endpoints.siteImages).then((o) => setOverrides(o as SiteImageOverrides)).catch(() => {});
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

  /** Upload the file, then point the built-in photo `key` to it */
  const replace = async (key: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Photo trop lourde", description: "5 Mo maximum.", variant: "destructive" });
      return;
    }
    setBusyKey(key);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${API_URL}${endpoints.upload.image}`, { method: "POST", body, credentials: "include" });
      if (!res.ok) throw new Error("upload");
      const { url } = (await res.json()) as { url: string };
      await apiClient.put(`${endpoints.siteImages}/${key}`, { url });
      setOverrides((o) => ({ ...o, [key]: url }));
      toast({ title: "Photo remplacée", description: "Elle apparaît sur le site d'ici une minute environ." });
    } catch {
      toast({ title: "Erreur", description: "La photo n'a pas pu être remplacée. Réessayez.", variant: "destructive" });
    } finally {
      setBusyKey(null);
    }
  };

  const reset = async (key: string, title: string) => {
    const ok = await confirm({
      title: "Remettre la photo d'origine ?",
      description: <>« {title} » retrouvera sa photo d&apos;origine partout sur le site.</>,
      confirmLabel: "Remettre l'originale",
      destructive: false,
    });
    if (!ok) return;
    setBusyKey(key);
    try {
      await apiClient.delete(`${endpoints.siteImages}/${key}`);
      setOverrides((o) => {
        const next = { ...o };
        delete next[key];
        return next;
      });
      toast({ title: "Photo d'origine rétablie" });
    } catch {
      toast({ title: "Erreur", description: "Réessayez.", variant: "destructive" });
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Photos du site</h1>
        <p className="mt-2 text-gray-600">Toutes les photos affichées sur le site et l&apos;endroit où elles apparaissent.</p>
      </div>

      <h2 className="mb-1 text-xl font-bold text-gray-900">Photos intégrées au site ({builtIn.length})</h2>
      <p className="mb-4 text-sm text-gray-500">
        « Remplacer » change la photo partout où elle apparaît sur le site (mise à jour en ligne en une minute environ).
      </p>
      <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {builtIn.map(({ key, img }) => {
          const replaced = overrides[key];
          const current = replaced ? absoluteUpload(replaced) : img.src;
          const isBlogCover = key.startsWith("blog");
          const busy = busyKey === key;
          return (
            <Card key={key} className={`overflow-hidden ${img.restriction && !replaced ? "ring-2 ring-amber-400" : ""}`}>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={current} alt={img.title} className="h-48 w-full object-cover" loading="lazy" />
                {replaced && (
                  <span className="absolute left-3 top-3 rounded-full bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
                    Remplacée
                  </span>
                )}
              </div>
              <CardContent className="space-y-3 pt-4">
                <p className="font-semibold text-gray-900">
                  <span className="mr-2 rounded bg-gray-900 px-1.5 py-0.5 text-xs text-white">{img.n}</span>
                  {img.title}
                </p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Utilisée sur</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                    {img.usedOn.map((u) => <li key={u}>{u}</li>)}
                  </ul>
                </div>
                {img.restriction && !replaced && (
                  <p className="flex gap-2 rounded-md bg-amber-50 p-2 text-xs font-medium text-amber-900">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> {img.restriction}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {isBlogCover ? (
                    <Link
                      href="/admin/blog"
                      className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Modifier dans Blog
                    </Link>
                  ) : (
                    <label
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 ${
                        busy ? "pointer-events-none opacity-60" : ""
                      }`}
                    >
                      <ImageUp className="h-3.5 w-3.5" /> {busy ? "Envoi…" : "Remplacer"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        disabled={busy}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) replace(key, file);
                        }}
                      />
                    </label>
                  )}
                  {replaced && !isBlogCover && (
                    <button
                      type="button"
                      onClick={() => reset(key, img.title)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Remettre l&apos;originale
                    </button>
                  )}
                  <a
                    href={current}
                    download={fileName(current)}
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="h-3.5 w-3.5" /> Télécharger
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
