import {
  describe,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
  expect,
  it,
} from 'bun:test';
import path from 'node:path';
import { Browser, chromium, firefox, Page, webkit } from 'playwright';

const engine: Record<string, any> = {
  chrome: chromium,
  firefox: firefox,
  safari: webkit,
};
const timeout = 30000;
const examples = [
  { id: 'with-api-routes' },
  { id: 'with-elysia' },
  { id: 'with-external-web-component' },
  { id: 'with-i18n' },
  { id: 'with-middleware' },
  { id: 'with-pandacss' },
  { id: 'with-sqlite-with-server-action' },
  { id: 'with-streaming-list' },
  { id: 'with-suspense' },
  { id: 'with-tailwindcss' },
  { id: 'with-view-transitions' },
];

describe.each(examples)('e2e example', (example) => {
  describe(example.id, () => {
    const { teardown, origin } = globalThis.examples[example.id];

    afterAll(teardown);

    describe.each(['chrome', 'firefox', 'safari'])('%s', (browserName) => {
      let browser: Browser;
      let page: Page;

      beforeAll(async () => {
        browser = await engine[browserName].launch();
      });

      beforeEach(async () => {
        page = await browser.newPage();
      });

      afterAll(async () => {
        await browser?.close?.();
      });

      afterEach(async () => {
        await page?.close?.();
      });

      it(`should load home page with status 200 and HTML content`, async () => {
        const response = await page.goto(origin, {
          waitUntil: 'load',
          timeout,
        });
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue('content-type')).toContain(
          'text/html',
        );
      });
    });
  });
});
