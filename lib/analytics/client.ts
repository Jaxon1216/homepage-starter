import { cleanReferrer, cleanUrl, EventLedger, EventQueue, pickProperties } from './core';
import { eventFields, type EventName, type EventProperties, type Properties } from './events';
import { umamiConfig } from './config';

type Payload = Record<string, unknown>;
type Job = { url: string; referrer: string; title: string; name?: EventName; data?: Properties };
declare global {
  interface Window {
    umami?: { track: (payload: (base: Payload) => Payload) => Promise<void> };
    homepageAnalyticsBeforeSend?: (type: string, payload: Payload) => Payload | null;
  }
}
type Context = { pathname: string; path: string; url: string; id: string; type: string; ledger: EventLedger };
let context: Context | undefined;
let configured = false;
let scriptFailed = false;
let ready = false;
let previousUrl = '';
let articlePaths = new Set<string>();
let release = umamiConfig.release;
const queue = new EventQueue<Job>();
const interactionEvents = new Set<EventName>([
  'book_open', 'book_close', 'resume_version_change', 'blog_filter_change',
  'media_close', 'theme_change', 'mobile_menu_toggle',
]);
const isCritical = (name?: EventName) => !name || /click$/.test(name) || interactionEvents.has(name) || name === 'app_error';

export function canTrack() {
  if (!umamiConfig.enabled || !configured || typeof window === 'undefined' || scriptFailed) return false;
  if (!umamiConfig.domains.includes(location.hostname)) return false;
  const dnt = navigator.doNotTrack || (window as unknown as { doNotTrack?: string | number }).doNotTrack || (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack;
  if (dnt === 1 || dnt === '1' || dnt === 'yes') return false;
  try { if (localStorage.getItem('umami.disabled')) return false; } catch { /* storage may be unavailable */ }
  return true;
}
export function configureAnalytics(enabled: boolean, paths: readonly string[] = [], deploymentRelease = umamiConfig.release) {
  configured = enabled;
  articlePaths = new Set(paths);
  release = deploymentRelease;
  window.homepageAnalyticsBeforeSend = (_type, payload) => {
    if (!canTrack()) { queue.clear(); return null; }
    return { ...payload, url: pageUrl(String(payload.url ?? '/')), referrer: pageReferrer(String(payload.referrer ?? '')), title: 'Homepage' };
  };
}
function deliver(job: Job) {
  if (!canTrack()) { queue.clear(); return; }
  if (!ready || !window.umami) { queue.push(job, Date.now(), isCritical(job.name)); return; }
  // Freeze the URL at occurrence time: delayed events must not inherit a later route.
  try {
    void window.umami.track(base => ({ ...base, url: job.url, referrer: job.referrer, title: job.title,
      ...(job.name ? { name: job.name, data: job.data } : {}) })).catch(() => {});
  } catch { /* Analytics must never interrupt navigation or interaction. */ }
}
export function analyticsReady() {
  ready = true;
  if (!canTrack()) { queue.clear(); return; }
  for (const job of queue.drain(Date.now())) deliver(job);
}
export function analyticsFailed() { scriptFailed = true; queue.clear(); }

function pageUrl(value: string) {
  const cleaned = cleanUrl(value);
  const path = cleaned.split('?')[0];
  return path.startsWith('/blog/') && !articlePaths.has(path) ? '/:unknown' : cleaned;
}
function pageReferrer(value: string) {
  const cleaned = cleanReferrer(value, location.origin);
  return cleaned.startsWith('/') ? pageUrl(cleaned).split('?')[0] : cleaned;
}
function pageType(path: string) {
  const override = document.querySelector<HTMLElement>('[data-analytics-page]')?.dataset.analyticsPage;
  if (override) return override;
  if (path === '/') return 'home';
  if (path.startsWith('/blog/')) return articlePaths.has(path) ? 'article' : 'not_found';
  return ({ '/blog': 'blog_list', '/resume': 'resume', '/about': 'about', '/inner-world': 'inner_world', '/footprint': 'footprint' } as Record<string, string>)[path] ?? 'not_found';
}
export function activatePage(force = false) {
  if (!canTrack()) { queue.clear(); return; }
  const type = pageType(location.pathname);
  const path = type === 'not_found' ? '/:unknown' : pageUrl(location.pathname).split('?')[0];
  if (!force && context?.pathname === location.pathname && context.type === type) return context;
  const url = type === 'not_found' ? '/:unknown' : pageUrl(location.href);
  const referrer = previousUrl || pageReferrer(document.referrer);
  previousUrl = url;
  context = { pathname: location.pathname, path, url, type, id: crypto.randomUUID().slice(0, 18), ledger: new EventLedger() };
  deliver({ url, referrer, title: 'Homepage' });
  if (type === 'not_found') trackEvent('not_found_view', { requested_path: '/:unknown' }, 'not-found');
  return context;
}
export function getPageContext() {
  return canTrack() && context?.pathname === location.pathname ? context : undefined;
}

const diagnosticEvents = new Set<EventName>(['theme_change', 'mobile_menu_toggle', 'media_close', 'book_close', 'comments_load', 'github_chart_view', 'resource_error']);
export function trackEvent<N extends EventName>(name: N, props: EventProperties<N>, onceKey?: string) {
  if (!canTrack()) { queue.clear(); return; }
  if (!Object.hasOwn(eventFields, name)) return;
  if (diagnosticEvents.has(name) && !umamiConfig.diagnostics) return;
  // Only the provider activates route changes after React has committed its DOM.
  const current = context ? getPageContext() : activatePage();
  if (!current) return;
  const critical = isCritical(name);
  if (!current.ledger.accept(onceKey ? `${name}:${onceKey}` : undefined, critical, Date.now())) return;
  const resume = document.querySelector<HTMLElement>('[data-analytics-resume-version]');
  const inherited: Properties = {};
  if (current.type === 'article') inherited.article_slug = current.path.slice('/blog/'.length);
  if (resume?.dataset.analyticsResumeVersion) inherited.resume_version = resume.dataset.analyticsResumeVersion;
  deliver({ url: current.url, referrer: '', title: 'Homepage', name, data: {
    ...pickProperties({ ...inherited, ...props }, eventFields[name]),
    schema_version: 2, page_type: current.type, page_path: current.path, page_view_id: current.id, release,
  } });
}

export function trackMarkedEvent(name: string | undefined, props: Record<string, unknown>, onceKey?: string) {
  if (name && Object.hasOwn(eventFields, name)) trackEvent(name as EventName, props as Properties, onceKey);
}
export function parseProperties(value?: string) {
  try { const props: unknown = JSON.parse(value ?? '{}'); return props && typeof props === 'object' && !Array.isArray(props) ? props as Properties : {}; }
  catch { return {}; }
}

/** Called only inside explicitly annotated content/link regions. */
export function trackContentLink(link: HTMLAnchorElement, placement: string) {
  try {
    const resumeVersion = link.closest<HTMLElement>('[data-analytics-resume-version]')?.dataset.analyticsResumeVersion;
    const version = resumeVersion ? { resume_version: resumeVersion } : {};
    const target = new URL(link.href);
    if (target.protocol === 'mailto:') { trackEvent('contact_click', { channel: 'email', placement, ...version }); return; }
    if (!['http:', 'https:'].includes(target.protocol)) return;
    if (target.origin === location.origin) return;
    // Links originate in authored content; strip query/hash and reject non-path characters.
    const targetPath = /^\/[a-zA-Z0-9_./-]{0,100}$/.test(target.pathname) ? target.pathname : '/:redacted';
    trackEvent('outbound_click', { target_host: target.hostname, target_path: targetPath, placement, ...version });
  } catch { /* invalid href */ }
}

export function mediaId(element: Element) {
  const scope = document.getElementById('post-content');
  const media = scope ? Array.from(scope.querySelectorAll('img, [data-analytics-media]')) : [];
  return `media-${Math.max(0, media.indexOf(element)) + 1}`;
}
