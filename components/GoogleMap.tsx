"use client";

import { GoogleMap as GMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_CENTER, COMPANY_INFO } from "@/lib/constants";
import { MapPin, ExternalLink } from "lucide-react";

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

export function GoogleMap({
  center = GOOGLE_MAPS_CENTER,
  zoom = 14,
  className = "h-[300px] rounded-lg overflow-hidden",
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} bg-neutral-950 flex flex-col items-center justify-center gap-3 text-center p-6 group hover:bg-neutral-900 transition-colors`}
      >
        <div className="w-12 h-12 rounded-full bg-sky-400/10 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-sky-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-white font-semibold">{COMPANY_INFO.address}</p>
          <p className="text-neutral-400 text-sm flex items-center justify-center gap-1 mt-1 group-hover:text-sky-400 transition-colors">
            Voir sur Google Maps
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </p>
        </div>
      </a>
    );
  }

  return (
    <div className={className}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          <Marker position={center} />
        </GMap>
      </LoadScript>
    </div>
  );
}
