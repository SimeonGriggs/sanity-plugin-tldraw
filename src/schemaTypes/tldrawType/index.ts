import {defineArrayMember, defineField} from 'sanity'

import {TldrawField} from './TldrawField'
import {TldrawInput} from './TldrawInput'

export const tldrawType = defineField({
  name: 'tldraw',
  title: 'tldraw',
  type: 'object',
  group: 'details',
  components: {
    field: TldrawField,
    input: TldrawInput,
  },
  fields: [
    defineField({
      name: 'document',
      type: 'string',
    }),
    defineField({
      name: 'sessions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'userId', type: 'string'}),
            defineField({name: 'session', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
})
