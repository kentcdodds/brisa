import fs from 'node:fs';
import { join } from 'node:path';
import { getConstants } from '@/constants';
import { logBuildError } from '@/utils/log/log-build';

type CompileActionsParams = {
  actionsEntrypoints: string[];
  define: Record<string, string>;
};

export async function buildActions({
  actionsEntrypoints,
  define,
}: CompileActionsParams) {
  const { BUILD_DIR, IS_PRODUCTION, CONFIG } = getConstants();
  const isNode = CONFIG.output === 'node' && IS_PRODUCTION;
  const rawActionsDir = join(BUILD_DIR, 'actions_raw');
  const barrelFile = join(rawActionsDir, 'index.ts');

  await Bun.write(
    barrelFile,
    actionsEntrypoints.map((p) => `export * from '${p}'`).join('\n'),
  );

  const external = CONFIG.external ? [...CONFIG.external, 'brisa'] : ['brisa'];
  const res = await Bun.build({
    entrypoints: [barrelFile],
    outdir: join(BUILD_DIR, 'actions'),
    external,
    sourcemap: IS_PRODUCTION ? undefined : 'inline',
    root: rawActionsDir,
    target: isNode ? 'node' : 'bun',
    minify: IS_PRODUCTION,
    splitting: true,
    define,
  });

  if (!res.success) {
    logBuildError('Failed to compile actions', res.logs);
  }

  fs.rmSync(rawActionsDir, { recursive: true });

  return res;
}
