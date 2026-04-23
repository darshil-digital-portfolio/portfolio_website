"use client";

import Image from "next/image";
import { useState } from "react";

interface ThumbnailImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}

export default function ThumbnailImage({ src, alt, sizes, className = "" }: ThumbnailImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-slate-100/60 dark:via-slate-700/60 to-transparent" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
        unoptimized
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </>
  );
}
