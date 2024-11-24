import compileAssets from '@/utils-build/compile-assets';
import compileFiles from '@/utils-build/compile-files';
import { logBuildError, logError } from '@/utils/log/log-build';
import handleCSSFiles from '@/utils-build/handle-css-files';

export default async function compileAll() {
  await compileAssets();

  try {
    const { success, logs, pagesSize } = await compileFiles();

    if (!success) {
      logBuildError('Failed to compile pages', logs);
    }

    await handleCSSFiles();

    return { success, logs, pagesSize };
  } catch (e: any) {
    logError({ messages: ['Failed to build', e.message], stack: e.stack });
    return { success: false, logs: [], pagesSize: 0 };
  }
}
