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
    <div className="border-t border-gray-200 pt-6">
      <p className="text-sm font-semibold text-gray-600 mb-3">
        Partager cet article :
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => share("facebook")}
          className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Partager sur Facebook"
        >
          <Facebook className="h-4 w-4" />
        </button>
        <button
          onClick={() => share("twitter")}
          className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Partager sur Twitter"
        >
          <Twitter className="h-4 w-4" />
        </button>
        <button
          onClick={() => share("linkedin")}
          className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Partager sur LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          onClick={copyLink}
          className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          aria-label="Copier le lien"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
