'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { activatePage, analyticsFailed, analyticsReady, canTrack, configureAnalytics, mediaId, parseProperties, trackContentLink, trackEvent, trackMarkedEvent } from '@/lib/analytics/client';
import { umamiConfig } from '@/lib/analytics/config';
import { observeExposures } from '@/lib/analytics/exposure';
import { observeAttention } from '@/lib/analytics/attention';

export function AnalyticsProvider({ enabled, articlePaths, release }: { enabled: boolean; articlePaths: string[]; release: string }) {
  const pathname = usePathname();
  useEffect(() => {
    configureAnalytics(enabled && umamiConfig.enabled, articlePaths, release);
    if (!canTrack()) return;
    let stopExposure = () => {};
    let stopAttention = () => {};
    let metadataFrame = 0;
    let activeId: string | undefined;
    const metadata = () => {
      metadataFrame = 0;
      if (location.pathname !== pathname) return;
      if (activatePage()?.id !== activeId) { start(); return; }
      const version = document.querySelector<HTMLElement>('[data-analytics-resume-version]')?.dataset.analyticsResumeVersion;
      if (version) trackEvent('resume_version_view', { version_id: version }, version);
      const error = document.querySelector<HTMLElement>('[data-analytics-error]');
      if (error) trackEvent('app_error', { error_code: 'route_render_error', ...(error.dataset.analyticsDigest ? { digest: error.dataset.analyticsDigest } : {}) }, 'route-error');
    };
    const start = (force = false) => {
      stopExposure(); stopAttention();
      activeId = activatePage(force)?.id;
      stopExposure = umamiConfig.exposure ? observeExposures() : () => {};
      stopAttention = observeAttention();
      metadata();
    };
    const click = (event: MouseEvent) => {
      if (event.button !== 0 && event.button !== 1) return;
      const target = event.target instanceof Element ? event.target : null;
      const marked = target?.closest<HTMLElement>('[data-analytics-click]');
      if (marked) {
        trackMarkedEvent(marked.dataset.analyticsClick, parseProperties(marked.dataset.analyticsProps));
        return;
      }
      const link = target?.closest<HTMLAnchorElement>('a[href]');
      const region = link?.closest<HTMLElement>('[data-analytics-links]');
      if (link && region) trackContentLink(link, region.dataset.analyticsLinks ?? 'content');
    };
    const resourceError = (event: Event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement)) return;
      if (image.closest('[data-analytics-article]')) trackEvent('resource_error', { resource_type: 'image', resource_id: mediaId(image), error_code: 'load_failed' }, mediaId(image));
      else if (image.dataset.analyticsResourceId) trackEvent('resource_error', { resource_type: 'image', resource_id: image.dataset.analyticsResourceId, error_code: 'load_failed' }, image.dataset.analyticsResourceId);
    };
    const resourceLoad = (event: Event) => {
      const frame = event.target;
      if (!(frame instanceof HTMLIFrameElement)) return;
      try {
        if (new URL(frame.src).hostname === 'giscus.app') trackEvent('comments_load', {}, 'comments');
      } catch { /* Ignore unrelated or malformed iframe URLs. */ }
    };
    const pageshow = (event: PageTransitionEvent) => { if (event.persisted) start(true); };
    const pagehide = () => { stopExposure(); stopAttention(); };
    const mutation = new MutationObserver(() => { if (!metadataFrame) metadataFrame = requestAnimationFrame(metadata); });
    mutation.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-analytics-page', 'data-analytics-error', 'data-analytics-resume-version'] });
    // Capture only explicit markers; never read arbitrary DOM labels or intercept navigation.
    document.addEventListener('click', click, true);
    document.addEventListener('error', resourceError, true);
    document.addEventListener('load', resourceLoad, true);
    document.addEventListener('auxclick', click, true);
    window.addEventListener('pageshow', pageshow);
    window.addEventListener('pagehide', pagehide);
    start();
    return () => {
      stopExposure(); stopAttention(); mutation.disconnect(); cancelAnimationFrame(metadataFrame);
      document.removeEventListener('click', click, true);
      document.removeEventListener('error', resourceError, true);
      document.removeEventListener('load', resourceLoad, true);
      document.removeEventListener('auxclick', click, true);
      window.removeEventListener('pageshow', pageshow);
      window.removeEventListener('pagehide', pagehide);
    };
  }, [enabled, pathname, articlePaths, release]);

  if (!enabled || !umamiConfig.enabled) return null;
  return <Script id="homepage-umami" src={umamiConfig.scriptUrl} strategy="afterInteractive"
    data-website-id={umamiConfig.websiteId} data-domains={umamiConfig.domains.join(',')}
    data-auto-pageview="false" data-exclude-hash="true" data-do-not-track="true"
    data-before-send="homepageAnalyticsBeforeSend" data-performance="false"
    onReady={analyticsReady} onError={analyticsFailed} />;
}
