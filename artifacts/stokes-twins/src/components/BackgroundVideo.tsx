import { useEffect, useRef, useState } from "react";

const videoUrls = import.meta.glob("../../../../attached_assets/*.mp4", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function resolveSources(base: string): { desktop: string; mobile: string } {
  let desktop = "";
  let mobile = "";
  for (const [path, url] of Object.entries(videoUrls)) {
    const file = path.split("/").pop() ?? "";
    if (file.startsWith(`${base}-mobile`)) {
      mobile = url;
    } else if (file.startsWith(`${base}_`) || file === `${base}.mp4`) {
      desktop = url;
    }
  }
  return { desktop: desktop || mobile, mobile: mobile || desktop };
}

export function BackgroundVideo({
  base,
  poster,
  className = "",
  overlayClassName,
}: {
  base: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState("");

  useEffect(() => {
    const { desktop, mobile } = resolveSources(base);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setSrc(isMobile ? mobile : desktop);
  }, [base]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    v.load();
    v.play().catch(() => {
      /* autoplay can be blocked until interaction; poster stays visible */
    });
  }, [src]);

  return (
    <div className={className} aria-hidden="true">
      {src ? (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
          data-testid={`bg-video-${base}`}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        poster && (
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      )}
      {overlayClassName && <div className={overlayClassName} />}
    </div>
  );
}
