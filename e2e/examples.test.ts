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
  {
    id: 'with-api-routes',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-elysia',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-external-web-component',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-i18n',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-middleware',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-pandacss',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-sqlite-with-server-action',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-streaming-list',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-suspense',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-tailwindcss',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
  {
    id: 'with-view-transitions',
    tests: [
      {
        title: 'should load home page with status 200 and HTML content',
        test: async (page: Page, origin: string) => {
          const response = await page.goto(origin, {
            waitUntil: 'load',
            timeout,
          });
          expect(response).not.toBeNull();
          expect(response!.status()).toBe(200);
          expect(await response!.headerValue('content-type')).toContain(
            'text/html',
          );
        },
      },
    ],
  },
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

      for (const { title, test } of example.tests) {
        it(title, async () => {
          await test(page, origin);
        });
      }
    });
  });
});
