"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";

interface SocialShareButtonsProps {
  title: string;
}

export function SocialShareButtons({ title }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => typeof window !== "undefined" ? window.location.href : "";

  const share = (platform: "facebook" | "twitter" | "linkedin") => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm font-medium text-neutral-500">Partager</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => share("facebook")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 ring-1 ring-neutral-200 transition hover:text-sky-700 hover:ring-sky-300 active:scale-95"
          aria-label="Partager sur Facebook"
        >
          <Facebook className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => share("twitter")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 ring-1 ring-neutral-200 transition hover:text-sky-700 hover:ring-sky-300 active:scale-95"
          aria-label="Partager sur Twitter"
        >
          <Twitter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => share("linkedin")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 ring-1 ring-neutral-200 transition hover:text-sky-700 hover:ring-sky-300 active:scale-95"
          aria-label="Partager sur LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 ring-1 ring-neutral-200 transition hover:text-sky-700 hover:ring-sky-300 active:scale-95"
          aria-label="Copier le lien"
        >
          {copied ? <Check className="h-4 w-4 text-sky-600" /> : <LinkIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
