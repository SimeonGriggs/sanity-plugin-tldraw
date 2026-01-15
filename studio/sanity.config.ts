import 'tldraw/tldraw.css'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {tldraw} from 'sanity-plugin-tldraw'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'tldraw Plugin Test',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [structureTool(), tldraw()],

  schema: {
    types: schemaTypes,
  },
})
