import { describe, it , expect, beforeAll, afterAll } from 'bun:test'
import { $, spawn } from 'bun'
import path from 'node:path'
import { chromium, firefox, webkit } from "playwright";

const browsers = [chromium, firefox, webkit]
const timeout = 30000
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
  { name: 'with-view-transitions' }
]

describe('e2e examples', () => {
  for (const example of examples) {
    describe(example.name, () => {
      const { setup, teardown, origin } = prepareProject(example.name);

      beforeAll(setup);
      afterAll(teardown);

      for (const browserType of browsers) {
        it(`should load home page with status 200 and HTML content on ${browserType.name()}`, async () => {
          const browser = await browserType.launch();
          try {
            const page = await browser.newPage();
            const response = await page.goto(origin, { timeout });
            expect(response).not.toBeNull();
            expect(response!.status()).toBe(200);
            expect(await response!.headerValue("content-type")).toContain("text/html");
         } finally {
            await browser.close();
         }
        });
      }
    });
  }
})

function prepareProject(exampleName: string) {
  let serverProcess

  globalThis.currentPort = globalThis.currentPort ? globalThis.currentPort + 1 : 3000

  async function setup() {
    const exampleDir = path.join(import.meta.dir, '..', 'examples', exampleName);

    console.log(`✅ Setting up ${exampleName} example...`);
    await $`cd ${exampleDir} && bun i && bun run build`;

    serverProcess = spawn({
      cmd: ["bun", "start", "-p", globalThis.currentPort.toString()],
      cwd: exampleDir,
      stdout: "inherit",
      stderr: "inherit",
    });
  }

  async function teardown() {
    console.log(`✅ Tearing down ${exampleName} example...`);
    await serverProcess.kill('SIGINT')
  }

  return { setup, teardown, origin: `http://localhost:${globalThis.currentPort}` }
}
