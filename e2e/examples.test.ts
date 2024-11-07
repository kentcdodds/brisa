import {
  describe,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
  expect,
  it,
} from 'bun:test';
import { $, spawn } from 'bun';
import path from 'node:path';
import { Browser, chromium, firefox, Page, webkit } from 'playwright';

const engine: Record<string, any> = {
  chrome: chromium,
  firefox: firefox,
  safari: webkit,
};
const timeout = 30000;
const examples = [
  { name: 'with-api-routes' },
  { name: 'with-elysia' },
  { name: 'with-external-web-component' },
  { name: 'with-i18n' },
  { name: 'with-middleware' },
  { name: 'with-pandacss' },
  { name: 'with-sqlite-with-server-action' },
  { name: 'with-streaming-list' },
  { name: 'with-suspense' },
  { name: 'with-tailwindcss' },
  { name: 'with-view-transitions' },
];

describe.each(examples)('e2e example', (example) => {
  describe(example.name, () => {
    const { setup, teardown, origin } = prepareProject(example.name);

    beforeAll(setup);
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
        expect(await (await page.$('body'))?.innerHTML()).toMatchSnapshot();
      });
    });
  });
});

function prepareProject(exampleName: string) {
  let serverProcess;

  globalThis.currentPort = globalThis.currentPort
    ? globalThis.currentPort + 1
    : 3000;

  async function setup() {
    const exampleDir = path.join(
      import.meta.dir,
      '..',
      'examples',
      exampleName,
    );

    console.log(`\t→ Setting up ${exampleName} example...`);
    await $`cd ${exampleDir} && bun i && bun run build`;

    serverProcess = spawn({
      cmd: ['bun', 'start', '-p', globalThis.currentPort.toString()],
      cwd: exampleDir,
      stdout: 'inherit',
      stderr: 'inherit',
    });

    await Bun.sleep(2000);
  }

  async function teardown() {
    console.log(`\t→ Tearing down ${exampleName} example...`);
    await serverProcess.kill('SIGINT');
  }

  return {
    setup,
    teardown,
    origin: `http://localhost:${globalThis.currentPort}`,
  };
}
