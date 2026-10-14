import { getPageContext, parseProperties, trackMarkedEvent } from './client';

/** Only observes explicit semantic markers, including nodes mounted after hydration. */
export function observeExposures() {
  const timers = new Map<Element, ReturnType<typeof setTimeout>>();
  const pending = new Map<Element, string>();
  const observed = new Set<HTMLElement>();
  const eligible = new Set<HTMLElement>();
  const sent = new Map<HTMLElement, string>();
  let frame = 0;
  const signature = (el: HTMLElement) => `${el.dataset.analyticsView}:${el.dataset.analyticsViewProps}`;
  const cancel = (el: Element) => { clearTimeout(timers.get(el)); timers.delete(el); pending.delete(el); };
  const schedule = (el: HTMLElement) => {
    if (document.visibilityState !== 'visible' || timers.has(el) || sent.get(el) === signature(el)) return;
    const id = getPageContext()?.id;
    const value = signature(el);
    pending.set(el, value);
    timers.set(el, setTimeout(() => {
      timers.delete(el); pending.delete(el);
      if (!el.isConnected || !eligible.has(el) || document.visibilityState !== 'visible' || id !== getPageContext()?.id || signature(el) !== value) return;
      const props = parseProperties(el.dataset.analyticsViewProps);
      trackMarkedEvent(el.dataset.analyticsView, props, JSON.stringify(props));
      sent.set(el, value);
    }, 1000));
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      const visible = entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0 && entry.isIntersecting && (el.dataset.analyticsViewMode === 'start' || entry.intersectionRatio >= 0.5);
      if (visible) { eligible.add(el); schedule(el); }
      else { eligible.delete(el); cancel(el); }
    }
  }, { threshold: [0, 0.5], rootMargin: '-64px 0px 0px 0px' });
  const scan = () => {
    frame = 0;
    for (const el of observed) {
      if (!el.isConnected) { observer.unobserve(el); cancel(el); observed.delete(el); eligible.delete(el); sent.delete(el); }
    }
    document.querySelectorAll<HTMLElement>('[data-analytics-view]').forEach(el => {
      if (!observed.has(el)) { observed.add(el); observer.observe(el); }
      else if (eligible.has(el)) {
        if (pending.has(el) && pending.get(el) !== signature(el)) cancel(el);
        schedule(el);
      }
    });
  };
  const mutation = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(scan); });
  mutation.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-analytics-view', 'data-analytics-view-props'] });
  const visibility = () => {
    for (const el of observed) {
      cancel(el);
      if (document.visibilityState === 'visible') { observer.unobserve(el); observer.observe(el); }
    }
    eligible.clear();
  };
  document.addEventListener('visibilitychange', visibility);
  scan();
  return () => {
    mutation.disconnect(); observer.disconnect(); cancelAnimationFrame(frame);
    for (const el of timers.keys()) cancel(el);
    document.removeEventListener('visibilitychange', visibility);
  };
}
