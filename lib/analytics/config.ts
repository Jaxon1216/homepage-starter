const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() ?? '';
const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim() ?? '';
const domains = (process.env.NEXT_PUBLIC_UMAMI_DOMAINS ?? '').split(',').map(value => value.trim()).filter(Boolean);

export const umamiConfig = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' && Boolean(websiteId && scriptUrl && domains.length),
  websiteId,
  scriptUrl,
  domains,
  release: (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 12),
  exposure: process.env.NEXT_PUBLIC_ANALYTICS_EXPOSURE !== 'false',
  reading: process.env.NEXT_PUBLIC_ANALYTICS_READING !== 'false',
  diagnostics: process.env.NEXT_PUBLIC_ANALYTICS_DIAGNOSTICS === 'true',
};
