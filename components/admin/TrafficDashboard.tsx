"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Users, Eye, FileText, Phone, TrendingUp, Smartphone, Monitor, Tablet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, endpoints } from "@/lib/api";
import { serviceLinks } from "@/lib/service-links";
import type { TrafficReport } from "@/types/api";

const PERIODS = [
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 365, label: "12 mois" },
];

const serviceName = (slug: string) => serviceLinks.find((s) => s.slug === slug)?.title ?? slug;
const pct = (part: number, total: number) => (total ? Math.min(100, Math.round((part / total) * 100)) : 0);

/** Horizontal bar list: label, bar proportional to value, value and optional extra columns. */
function BarList({
  rows,
  empty = "Pas encore de données",
}: {
  rows: { label: string; value: number; extra?: string }[];
  empty?: string;
}) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-gray-400">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="relative flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm">
          <span className="absolute inset-y-0 left-0 rounded-md bg-sky-100" style={{ width: `${(r.value / max) * 100}%` }} />
          <span className="relative truncate font-medium text-gray-800">{r.label}</span>
          <span className="relative shrink-0 tabular-nums text-gray-600">
            {r.value}
            {r.extra && <span className="ml-2 text-xs text-gray-500">{r.extra}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Visitor analytics (cookieless, first-party). Data: GET /analytics/traffic.
 * "Visiteurs" = unique visitors per day, summed over the period.
 */
export function TrafficDashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<TrafficReport | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get(endpoints.analytics.traffic(days))
      .then((r: TrafficReport) => !cancelled && (setData(r), setError(false)))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [days]);

  const conversions = (quotes: number, calls: number) =>
    [quotes && `${quotes} devis`, calls && `${calls} appel${calls > 1 ? "s" : ""}`].filter(Boolean).join(" · ");

  const t = data?.totals;
  const kpis = [
    { label: "Visiteurs", value: t?.visitors, icon: Users, color: "bg-sky-500" },
    { label: "Pages vues", value: t?.pageViews, icon: Eye, color: "bg-indigo-500" },
    { label: "Demandes de devis", value: t?.quotes, icon: FileText, color: "bg-emerald-500" },
    { label: "Clics sur le téléphone", value: t?.phoneClicks, icon: Phone, color: "bg-amber-500" },
    { label: "Taux de contact", value: t ? `${t.conversionRate} %` : undefined, icon: TrendingUp, color: "bg-rose-500", hint: "Visiteurs ayant appelé ou demandé un devis" },
  ];
  const deviceIcon = { mobile: Smartphone, tablet: Tablet, desktop: Monitor } as const;
  const deviceLabel = { mobile: "Mobile", tablet: "Tablette", desktop: "Ordinateur" } as const;
  const totalDeviceVisitors = data?.devices.reduce((s, d) => s + d.visitors, 0) ?? 0;

  return (
    <section className="mb-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visiteurs du site</h2>
          <p className="mt-1 text-sm text-gray-500">Statistiques anonymes, sans cookie ni adresse IP — conservées 25 mois.</p>
        </div>
        <div className="inline-flex rounded-lg border bg-white p-1" role="tablist" aria-label="Période">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              role="tab"
              aria-selected={days === p.days}
              onClick={() => setDays(p.days)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${days === p.days ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">Impossible de charger les statistiques de visite.</p>}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} title={k.hint}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500">{k.label}</p>
                  <span className={`${k.color} rounded-md p-1.5`}><Icon className="h-4 w-4 text-white" /></span>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">{k.value ?? "—"}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Fréquentation</CardTitle></CardHeader>
          <CardContent>
            {data?.timeline.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickFormatter={(d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(d) => new Date(String(d)).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" })}
                    formatter={(v, n) => [v, n === "visitors" ? "Visiteurs" : "Pages vues"]}
                  />
                  <Area type="monotone" dataKey="pageViews" stroke="#818cf8" fill="#e0e7ff" strokeWidth={2} />
                  <Area type="monotone" dataKey="visitors" stroke="#0284c7" fill="#bae6fd" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-16 text-center text-sm text-gray-400">Pas encore de visites sur cette période</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>D&apos;où viennent les visiteurs</CardTitle></CardHeader>
          <CardContent>
            <BarList rows={(data?.sources ?? []).map((s) => ({ label: s.source, value: s.visitors, extra: conversions(s.quotes, s.phoneClicks) }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Villes</CardTitle></CardHeader>
          <CardContent>
            <BarList rows={(data?.cities ?? []).map((c) => ({ label: c.city, value: c.visitors }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pages les plus vues</CardTitle></CardHeader>
          <CardContent>
            <BarList rows={(data?.pages ?? []).map((p) => ({ label: p.path, value: p.pageViews }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Services : visites → devis</CardTitle></CardHeader>
          <CardContent>
            <BarList
              rows={(data?.services ?? []).map((s) => ({
                label: serviceName(s.service),
                value: s.visits,
                extra: `${s.quotes} devis · ${pct(s.quotes, s.visits)} %`,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Campagnes publicitaires</CardTitle></CardHeader>
          <CardContent>
            {data?.campaigns.length ? (
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500">
                  <tr><th className="pb-2 font-medium">Campagne</th><th className="pb-2 text-right font-medium">Visiteurs</th><th className="pb-2 text-right font-medium">Devis</th><th className="pb-2 text-right font-medium">Appels</th><th className="pb-2 text-right font-medium">Taux</th></tr>
                </thead>
                <tbody>
                  {data.campaigns.map((c) => (
                    <tr key={c.campaign} className="border-t">
                      <td className="py-2 font-medium text-gray-800">{c.campaign}</td>
                      <td className="py-2 text-right tabular-nums">{c.visitors}</td>
                      <td className="py-2 text-right tabular-nums">{c.quotes}</td>
                      <td className="py-2 text-right tabular-nums">{c.phoneClicks}</td>
                      <td className="py-2 text-right tabular-nums">{pct(c.quotes + c.phoneClicks, c.visitors)} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">
                Aucune campagne. Ajoutez <code className="rounded bg-gray-100 px-1">utm_campaign</code> aux liens de vos annonces pour les voir ici.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Appareils</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(data?.devices ?? []).map((d) => {
              const Icon = deviceIcon[d.device as keyof typeof deviceIcon] ?? Monitor;
              return (
                <div key={d.device} className="flex items-center gap-3 text-sm">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <span className="flex-1 text-gray-700">{deviceLabel[d.device as keyof typeof deviceLabel] ?? d.device}</span>
                  <span className="font-semibold tabular-nums">{pct(d.visitors, totalDeviceVisitors)} %</span>
                </div>
              );
            })}
            {!data?.devices.length && <p className="py-6 text-center text-sm text-gray-400">Pas encore de données</p>}
          </CardContent>
        </Card>

        {data && data.quoteFunnel.some((f) => f.step !== "Envoyé") && (
          <Card className="lg:col-span-3">
            <CardHeader><CardTitle>Formulaire de devis : où les visiteurs abandonnent</CardTitle></CardHeader>
            <CardContent>
              <BarList rows={data.quoteFunnel.map((f) => ({ label: f.step === "Envoyé" ? "Demande envoyée" : `Étape ${f.step} atteinte`, value: f.visitors }))} />
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
