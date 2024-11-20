import compileAssets from '@/build-process/1-public-assets/compile-assets';
import compileEntrypoints from '@/build-process/2-entrypoints';
import { logBuildError, logError } from '@/utils/log/log-build';
import compileCSSFiles from '@/build-process/3-css-files';

export default async function compileAll() {
  await compileAssets();

  try {
    const { success, logs, pagesSize } = await compileEntrypoints();

    if (!success) {
      logBuildError('Failed to compile pages', logs);
    }

    await compileCSSFiles();

    return { success, logs, pagesSize };
  } catch (e: any) {
    logError({ messages: ['Failed to build', e.message], stack: e.stack });
    return { success: false, logs: [], pagesSize: 0 };
  }
}
