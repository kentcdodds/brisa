import type {
  RerenderInActionProps,
  RenderPageProps,
  RenderComponentProps,
} from '@/types/server';
import { blueLog } from '@/utils/log/log-color';

export const PREFIX_MESSAGE = 'Error rerendering within action: ';
export const SUFFIX_MESSAGE = `\n\nPlease use the 'renderPage' / 'renderComponent' function inside a server action without using a try-catch block\nbecause is a throwable caught by Brisa to rerender the component or page.\n\nMore details: ${blueLog(
  'https://brisa.build/api-reference/server-apis/renderPage',
)}`;

/**
 * TODO: Remove this function + types in 0.3
 * @deprecated Use `renderPage` or `renderComponent` instead.
 */
export default function rerenderInAction<T>(
  config: RerenderInActionProps<T> = {},
) {
  console.warn(
    'BREAKING CHANGE: `rerenderInAction` is not more supported. Use `renderPage` or `renderComponent` instead.',
  );
}

export function renderPage<T>(config: RenderPageProps = {}) {
  const renderMode = config.withTransition ? 'transition' : 'reactivity';

  const throwable = new Error(
    `${PREFIX_MESSAGE}${JSON.stringify({ type: 'page', renderMode })}${SUFFIX_MESSAGE}`,
  );

  throwable.name = 'rerender';

  throw throwable;
}

export function renderComponent(config: RenderComponentProps = {}) {
  const type = config.target ?? 'component';
  const renderMode = config.withTransition ? 'transition' : 'reactivity';
  const mode = config.mode ?? 'replace';

  const throwable = new Error(
    `${PREFIX_MESSAGE}${JSON.stringify({ type, renderMode, mode })}${SUFFIX_MESSAGE}`,
  );

  if (type !== 'page') {
    // @ts-ignore
    throwable[Symbol.for('element')] = config.element;
  }

  throwable.name = 'rerender';

  throw throwable;
}
