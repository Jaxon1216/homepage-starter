const repo = process.env.NEXT_PUBLIC_GISCUS_REPO?.trim() ?? '';
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID?.trim() ?? '';
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY?.trim() ?? '';
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID?.trim() ?? '';

export const integrationConfig = {
  vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true',
  giscus: {
    enabled: process.env.NEXT_PUBLIC_GISCUS_ENABLED === 'true' && Boolean(repo && repoId && category && categoryId),
    repo,
    repoId,
    category,
    categoryId,
  },
};
