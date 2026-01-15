import 'tldraw/tldraw.css'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {tldraw} from 'sanity-plugin-tldraw'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'tldraw Plugin Test',

  projectId: 'az8av6xl',
  dataset: 'development',

  plugins: [structureTool(), tldraw()],

  schema: {
    types: schemaTypes,
  },
})
