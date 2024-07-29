import 'tldraw/tldraw.css'

import {definePlugin} from 'sanity'

import {TldrawModalProvider} from './components/TldrawModal'
// import {tldrawAction} from './fieldActions'
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
  return {
    name: 'sanity-plugin-tldraw',
    schema: {
      types: [tldrawType],
    },
    studio: {
      components: {
        layout: (props) => TldrawModalProvider({children: props.renderDefault(props)}),
      },
    },
    // I'd like to add a 'toggle fullscreen' field action but it's *too* unstable
    // document: {
    //   unstable_fieldActions: (prev) => {
    //     return [...prev, tldrawAction]
    //   },
    // },
  }
})
