import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import Module from 'node:module';
import path from 'node:path';
const filename = path.resolve('lib/article-toc.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const loaded = new Module(filename);
loaded._compile(compiled, filename);
const helpers = loaded.exports;

test('向下和向上阅读时，使用已越过阅读线的最后一个标题', () => {
  assert.equal(helpers.getActiveHeadingIndex([-300, 80, 180], 96, false), 1);
  assert.equal(helpers.getActiveHeadingIndex([-300, 110, 180], 96, false), 0);
});
test('文章开头和到达正文末尾时能定位首尾章节', () => {
  assert.equal(helpers.getActiveHeadingIndex([200, 500], 96, false), 0);
  assert.equal(helpers.getActiveHeadingIndex([-200, 300], 96, true), 1);
});
test('当前目录项在安全区内时不滚动，超出上下边缘时留下余量', () => {
  assert.equal(helpers.getTocScrollTop(100, 400, 200, 32, 1000), 100);
  assert.equal(helpers.getTocScrollTop(100, 400, 600, 32, 1000), 272);
  assert.equal(helpers.getTocScrollTop(300, 400, 200, 32, 1000), 160);
});
test('目录首尾滚动不越界，超高目录项对齐顶部', () => {
  assert.equal(helpers.getTocScrollTop(100, 400, 0, 32, 1000), 0);
  assert.equal(helpers.getTocScrollTop(0, 400, 980, 20, 1000), 600);
  assert.equal(helpers.getTocScrollTop(0, 100, 150, 200, 500), 140);
});
