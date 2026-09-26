"use client";

import { GoogleMap } from "@/components/GoogleMap";
import { CITY_COORDINATES, GOOGLE_MAPS_CENTER } from "@/lib/constants";

interface CityMapProps {
  slug: string;
}

export function CityMap({ slug }: CityMapProps) {
  const center = CITY_COORDINATES[slug] || GOOGLE_MAPS_CENTER;

  return (
    <GoogleMap
      center={center}
      zoom={14}
      className="h-[350px] overflow-hidden rounded-2xl ring-1 ring-neutral-200"
    />
  );
}
