"use client";

import dynamic from 'next/dynamic';

const PhotosClient = dynamic(() => import('./PhotosClient'), { ssr: false });

export default function PhotosPage() {
  return <PhotosClient />;
}
