import {definePlugin} from 'sanity'

import {tldrawType} from './schemaTypes/tldrawType'

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {tldraw} from 'sanity-plugin-tldraw'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [tldraw()],
 * })
 * ```
 */
export const tldraw = definePlugin(() => {
  // eslint-disable-next-line no-console
  console.log('hello from sanity-plugin-tldraw')
  return {
    name: 'sanity-plugin-tldraw',
    schema: {
      types: [tldrawType],
    },
  }
})
