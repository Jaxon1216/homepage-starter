/** Pure policy helpers; no browser or SDK dependency. */
export function cleanPath(path: string): string {
  if (/^\/(?:blog|resume|about|inner-world|footprint)?\/?$/.test(path)) return path.replace(/\/$/, '') || '/';
  if (/^\/blog\/[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}\/?$/.test(path)) return path.replace(/\/$/, '');
  return '/:unknown';
}

export function cleanUrl(value: string): string {
  try {
    const url = new URL(value, 'https://example.com');
    const path = cleanPath(url.pathname);
    if (path === '/:unknown') return path;
    const query = new URLSearchParams();
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const val = url.searchParams.get(key);
      // Campaign values must be controlled labels, never arbitrary input.
      if (val && /^[a-zA-Z0-9_-]{1,80}$/.test(val)) query.set(key, val);
    }
    return path + (query.size ? `?${query}` : '');
  } catch { return '/:unknown'; }
}

export function cleanReferrer(value: string, siteOrigin = 'https://example.com'): string {
  if (!value) return '';
  try {
    const base = new URL(siteOrigin);
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return url.origin === base.origin ? cleanPath(url.pathname) : url.origin;
  } catch { return ''; }
}

export function pickProperties(input: Record<string, unknown>, keys: readonly string[]) {
  const output: Record<string, string | number | boolean> = {};
  for (const key of keys.slice(0, 16)) {
    const value = input[key];
    if (typeof value === 'string') output[key] = value.slice(0, 120);
    else if (typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) output[key] = value;
  }
  return output;
}

export class EventLedger {
  private seen = new Set<string>();
  private count = 0;
  private second = -1;
  private clicks = 0;
  accept(key: string | undefined, critical: boolean, now: number) {
    if (key && this.seen.has(key)) return false;
    if (!critical && this.count >= 150) return false;
    const second = Math.floor(now / 1000);
    if (this.second !== second) { this.second = second; this.clicks = 0; }
    if (critical && this.clicks >= 10) return false;
    if (critical) this.clicks++;
    if (key) this.seen.add(key);
    this.count++;
    return true;
  }
}

export class EventQueue<T> {
  private entries: { value: T; time: number; critical: boolean }[] = [];
  push(value: T, now: number, critical: boolean) {
    this.entries = this.entries.filter(entry => now - entry.time <= 10000);
    if (this.entries.length >= 50) {
      const index = this.entries.findIndex(entry => !entry.critical);
      if (index < 0 && !critical) return;
      this.entries.splice(index < 0 ? 0 : index, 1);
    }
    this.entries.push({ value, time: now, critical });
  }
  drain(now: number): T[] {
    const values = this.entries.filter(entry => now - entry.time <= 10000).map(entry => entry.value);
    this.clear();
    return values;
  }
  clear() { this.entries = []; }
}

export function activeMilliseconds(previous: number, now: number, lastInput: number, eligible: boolean) {
  return eligible ? Math.max(0, Math.min(now, lastInput + 60000) - previous) : 0;
}
export function readDepth(top: number, bottom: number, viewportHeight: number) {
  if (bottom <= top || top >= viewportHeight) return 0;
  return Math.max(0, Math.min(100, ((viewportHeight - top) / (bottom - top)) * 100));
}
export function qualifiedReadingSeconds(estimatedSeconds: number) {
  return Math.min(120, Math.max(15, estimatedSeconds * 0.3));
}
export function isQualifiedRead(depth: number, seconds: number, requiredSeconds: number) {
  return depth >= 90 && seconds >= requiredSeconds;
}
