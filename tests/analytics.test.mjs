import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import Module from 'node:module';
import path from 'node:path';
const filename = path.resolve('lib/analytics/core.ts');
const loaded = new Module(filename);
// Keep the tests runnable with the project's existing Node + TypeScript dependencies.
if (fs.existsSync(filename)) loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const core = loaded.exports;

test('只保留正式页面和允许的 UTM，丢弃敏感参数/hash', () => {
  assert.equal(core.cleanUrl('/blog/test?email=a@b.com&utm_source=github#secret'), '/blog/test?utm_source=github');
  assert.equal(core.cleanUrl('/private/alice@example.com?token=abc'), '/:unknown');
  assert.equal(core.cleanReferrer('https://outside.test/private?token=abc'), 'https://outside.test');
  assert.equal(core.cleanReferrer('https://example.com/blog/test?secret=abc'), '/blog/test');
  assert.equal(core.cleanReferrer('https://alternate.example/blog/test', 'https://alternate.example'), '/blog/test');
  assert.equal(core.cleanReferrer('https://example.com/blog/test', 'https://alternate.example'), 'https://example.com');
});
test('曝光去重保留合法重复点击，预算不丢弃核心交互', () => {
  const ledger = new core.EventLedger();
  assert.equal(ledger.accept('project_impression:a', false, 0), true);
  assert.equal(ledger.accept('project_impression:a', false, 1000), false);
  assert.equal(ledger.accept(undefined, true, 1000), true);
  assert.equal(ledger.accept(undefined, true, 1000), true);
  for (let i = 0; i < 200; i++) ledger.accept(`view:${i}`, false, i * 1000);
  assert.equal(ledger.accept('new_view', false, 300000), false);
  assert.equal(ledger.accept(undefined, true, 300000), true);
});
test('队列过期、限制容量，优先保留核心点击和发生时的页面', () => {
  const queue = new core.EventQueue();
  queue.push({ url: '/resume', name: 'contact_click' }, 0, true);
  for (let i = 0; i < 60; i++) queue.push({ url: '/', name: 'project_impression' }, 1000, false);
  const batch = queue.drain(2000);
  assert.equal(batch.length, 50);
  assert.equal(batch[0].url, '/resume');
  queue.push({ url: '/', name: 'old' }, 0, false);
  assert.equal(queue.drain(10001).length, 0);
  assert.equal(queue.drain(10002).length, 0);
});
test('后台和空闲时间不计阅读，跨越空闲截止只算截止前时段', () => {
  assert.equal(core.activeMilliseconds(0, 1000, 0, true), 1000);
  assert.equal(core.activeMilliseconds(0, 1000, 0, false), 0);
  assert.equal(core.activeMilliseconds(59000, 62000, 0, true), 1000);
  assert.equal(core.activeMilliseconds(61000, 62000, 0, true), 0);
});
test('短文章完整曝光可以达底，长文章跳底不能跳过时长条件', () => {
  assert.equal(core.readDepth(100, 500, 800), 100);
  assert.equal(core.readDepth(100, 2100, 600), 25);
  assert.equal(core.qualifiedReadingSeconds(1000), 120);
  assert.equal(core.qualifiedReadingSeconds(10), 15);
  assert.equal(core.isQualifiedRead(100, 0, 120), false);
  assert.equal(core.isQualifiedRead(90, 120, 120), true);
});
test('未知字段和嵌套内容无法进入属性载荷', () => {
  assert.deepEqual(core.pickProperties({ project_id: 'genbi', email: 'a@b.com', stack: 'secret', position: 1, details: {} }, ['project_id', 'position']), { project_id: 'genbi', position: 1 });
});

test('保留现有大小写混合的真实文章 slug', () => {
  assert.equal(core.cleanPath('/blog/browserRendering'), '/blog/browserRendering');
  assert.equal(core.cleanUrl('/blog/eventLoop?token=secret'), '/blog/eventLoop');
});
