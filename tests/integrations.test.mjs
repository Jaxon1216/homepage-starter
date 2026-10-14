import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function config(file, env = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, { exports, process: { env } });
  return exports;
}

test('默认关闭第三方统计和评论且不包含预设站点标识', () => {
  const { umamiConfig } = config('lib/analytics/config.ts');
  assert.equal(umamiConfig.enabled, false);
  assert.equal(umamiConfig.websiteId, '');
  assert.equal(umamiConfig.scriptUrl, '');
  assert.equal(umamiConfig.domains.length, 0);
  const { integrationConfig } = config('lib/integrations.ts');
  assert.equal(integrationConfig.vercelAnalytics, false);
  assert.equal(integrationConfig.giscus.enabled, false);
  assert.equal(integrationConfig.giscus.repo, '');
});

test('Umami 需要显式启用且配置完整', () => {
  const complete = {
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: 'test-only',
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: 'https://metrics.example.com/script.js',
    NEXT_PUBLIC_UMAMI_DOMAINS: ' example.com, www.example.com ',
  };
  for (const env of [
    { NEXT_PUBLIC_ANALYTICS_ENABLED: 'true' },
    { ...complete, NEXT_PUBLIC_ANALYTICS_ENABLED: 'false' },
    { ...complete, NEXT_PUBLIC_ANALYTICS_ENABLED: 'true', NEXT_PUBLIC_UMAMI_WEBSITE_ID: ' ' },
    { ...complete, NEXT_PUBLIC_ANALYTICS_ENABLED: 'true', NEXT_PUBLIC_UMAMI_SCRIPT_URL: '' },
    { ...complete, NEXT_PUBLIC_ANALYTICS_ENABLED: 'true', NEXT_PUBLIC_UMAMI_DOMAINS: ' , ' },
  ]) assert.equal(config('lib/analytics/config.ts', env).umamiConfig.enabled, false);
  const { umamiConfig } = config('lib/analytics/config.ts', { ...complete, NEXT_PUBLIC_ANALYTICS_ENABLED: 'true' });
  assert.equal(umamiConfig.enabled, true);
  assert.equal(umamiConfig.domains.join(','), 'example.com,www.example.com');
});

test('Giscus 需要显式启用且四项配置完整，Vercel Analytics 单独启用', () => {
  const complete = {
    NEXT_PUBLIC_GISCUS_REPO: 'example/site',
    NEXT_PUBLIC_GISCUS_REPO_ID: 'repo-id',
    NEXT_PUBLIC_GISCUS_CATEGORY: 'Announcements',
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: 'category-id',
  };
  assert.equal(config('lib/integrations.ts', { NEXT_PUBLIC_GISCUS_ENABLED: 'true' }).integrationConfig.giscus.enabled, false);
  for (const key of Object.keys(complete)) {
    const { integrationConfig } = config('lib/integrations.ts', { ...complete, [key]: ' ', NEXT_PUBLIC_GISCUS_ENABLED: 'true' });
    assert.equal(integrationConfig.giscus.enabled, false, key);
  }
  assert.equal(config('lib/integrations.ts', complete).integrationConfig.giscus.enabled, false);
  const { integrationConfig } = config('lib/integrations.ts', {
    ...complete, NEXT_PUBLIC_GISCUS_ENABLED: 'true', NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED: 'true',
  });
  assert.equal(integrationConfig.giscus.enabled, true);
  assert.equal(integrationConfig.giscus.repo, 'example/site');
  assert.equal(integrationConfig.vercelAnalytics, true);
});
