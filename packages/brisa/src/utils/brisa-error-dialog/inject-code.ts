import path from 'node:path';
import clientBuildPlugin from '@/utils/client-build-plugin';
import { logBuildError } from '@/utils/log/log-build';

// Should be used via macro
export async function injectBrisaDialogErrorCode() {
  const pathname = path.join(
    import.meta.dir,
    'web-components',
    'brisa-error-dialog.tsx',
  );
  const internalComponentId = '__BRISA_CLIENT__brisaErrorDialog';

  const { success, logs, outputs } = await Bun.build({
    entrypoints: [pathname],
    target: 'browser',
    external: ['brisa'],
    define: {
      __FILTER_DEV_RUNTIME_ERRORS__: '__FILTER_DEV_RUNTIME_ERRORS__',
    },
    plugins: [
      {
        name: 'dev-error-dialog-plugin',
        setup(build) {
          build.onLoad({ filter: /.*/ }, async ({ path, loader }) => ({
            contents: clientBuildPlugin(
              // TODO: use (path).text() when Bun fix this issue:
              // https://github.com/oven-sh/bun/issues/7611
              await Bun.readableStreamToText(Bun.file(path).stream()),
              internalComponentId,
            ),
            loader,
          }));
        },
      },
    ],
  });

  if (!success) {
    logBuildError('Failed to use brisa dialog error in development', logs);
  }

  return (await outputs?.[0]?.text?.()) ?? '';
}
