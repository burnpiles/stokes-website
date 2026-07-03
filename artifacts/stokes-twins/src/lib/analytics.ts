declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let scriptLoaded = false;
let activeGaId: string | null = null;

export function initAnalytics(gaId?: string | null): void {
  const id = gaId?.trim() || null;
  if (id === activeGaId) return;

  if (!id) {
    // Cleared in the admin — stop emitting events immediately.
    activeGaId = null;
    return;
  }

  if (!scriptLoaded) {
    scriptLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
  }

  activeGaId = id;
  window.gtag("config", id, { send_page_view: false });

  // The GA ID arrives asynchronously (from site settings), so the initial
  // page view is sent here rather than by the route-change effect.
  trackPageView(window.location.pathname + window.location.search);
}

export function trackPageView(path: string): void {
  if (!activeGaId) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!activeGaId) return;
  window.gtag("event", name, params ?? {});
}
