import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('曝光稳定期间属性变化，重新计时并上报新状态', () => {
  let time = 0, serial = 0, mutation, frame;
  const timers = new Map(), events = [];
  const element = { isConnected: true, dataset: { analyticsView: 'project_impression', analyticsViewProps: '{"project_id":"before","category":"ForStudy"}' } };
  const sandbox = {
    Map, Set, JSON,
    document: { body: {}, visibilityState: 'visible', querySelectorAll: () => [element], addEventListener: () => {}, removeEventListener: () => {} },
    setTimeout: (fn, delay) => { const id = ++serial; timers.set(id, { at: time + delay, fn }); return id; },
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => { frame = fn; return 1; }, cancelAnimationFrame: () => {},
    MutationObserver: class { constructor(callback) { mutation = callback; } observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(callback) { this.callback = callback; } observe(target) { this.callback([{ target, isIntersecting: true, intersectionRatio: 1, boundingClientRect: { width: 100, height: 100 } }]); } unobserve() {} disconnect() {} },
  };
  const compiledModule = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync('lib/analytics/exposure.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const fn = vm.runInNewContext(`(function(require,module,exports){${compiled}\n})`, sandbox);
  fn(() => ({ getPageContext: () => ({ id: 'page1' }), parseProperties: JSON.parse, trackMarkedEvent: (name, props) => events.push({ name, props }) }), compiledModule, compiledModule.exports);
  const stop = compiledModule.exports.observeExposures();
  const advance = now => { time = now; for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn(); } };
  advance(500);
  element.dataset.analyticsViewProps = '{"project_id":"after","category":"ForStudy"}';
  mutation(); frame();
  advance(1000);
  assert.equal(events.length, 0);
  advance(1500);
  assert.equal(events.length, 1);
  assert.equal(events[0].props.project_id, 'after');
  stop();
});
