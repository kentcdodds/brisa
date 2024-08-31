import { jsx } from 'brisa/jsx-runtime';

export default async function SomePage() {
  return jsx('h1', { children: 'Some page' });
}

export function responseHeaders(request) {
  return {
    'x-test': 'test',
    'x-renderInitiator': request.renderInitiator,
    cookie: 'test=1; Path=/; Max-Age=3600',
  };
}