import { describe, it , expect, beforeAll, afterAll } from 'bun:test'
import { $, spawn } from 'bun'
import fs from 'node:fs'
import path from 'node:path'
import { chromium, firefox, webkit } from "playwright";

const browsers = [chromium, firefox, webkit]

describe('e2e examples', () => {
  describe('with-api-routes', () => {
    const { setup, teardown } = prepareProject('with-api-routes')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-elysia', () => {
    const { setup, teardown } = prepareProject('with-elysia')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-external-web-component', () => {
    const { setup, teardown } = prepareProject('with-elysia')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-i18n', () => {
    const { setup, teardown } = prepareProject('with-i18n')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-middleware', () => {
    const { setup, teardown } = prepareProject('with-middleware')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-pandacss', () => {
    const { setup, teardown } = prepareProject('with-pandacss')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-sqlite-with-server-action', () => {
    const { setup, teardown } = prepareProject('with-sqlite-with-server-action')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-streaming-list', () => {
    const { setup, teardown } = prepareProject('with-streaming-list')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-suspense', () => {
    const { setup, teardown } = prepareProject('with-suspense')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-tailwindcss', () => {
    const { setup, teardown } = prepareProject('with-tailwindcss')

    beforeAll(setup);
    afterAll(teardown);

    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
  
  describe('with-view-transitions', () => {
    const { setup, teardown } = prepareProject('with-view-transitions')

    beforeAll(setup);
    afterAll(teardown);
    
    for (const browserType of browsers) {
      it(`should load home page with status 200 and HTML content on ${browserType}`, async () => {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const response = await page.goto('http://localhost:3000');
        expect(response).not.toBeNull();
        expect(response!.status()).toBe(200);
        expect(await response!.headerValue("content-type")).toContain("text/html");
        await browser.close();
      });
    }
  })
})

function prepareProject(exampleName: string) {
  let serverProcess

  async function setup() {
    const exampleDir = path.join(import.meta.dir, '..', 'examples', exampleName);

    console.log(`✅ Setting up ${exampleName} example...`);
    await $`cd ${exampleDir} && bun i && bun run build`;

    serverProcess = spawn({
      cmd: ["bun", "start"],
      cwd: exampleDir,
      stdout: "inherit",
      stderr: "inherit",
    });

    await Bun.sleep(1000);
  }

  async function teardown() {
    await serverProcess.kill()
  }

  return { setup, teardown }
}
