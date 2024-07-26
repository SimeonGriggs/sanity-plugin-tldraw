# sanity-plugin-tldraw

Add a tldraw canvas to your Sanity Studio and React app in just 5 minutes.

- [tldraw SDK](https://tldraw.dev)
- [tldraw](https://www.tldraw.com)

## Installation

Inside your Sanity Studio

```sh
npm install sanity-plugin-tldraw
```

If you do not yet have a Sanity Studio, you can create a new free project with the following command

```sh
npm create sanity@latest
```

### Use in Sanity Studio

Add it as a plugin in `sanity.config.ts`.

You will also need to import tldraw's CSS. Ideally this won't be necessary in a future release.

```ts
// 1️⃣ import tldraw's css
import 'tldraw/tldraw.css'

import {defineConfig} from 'sanity'

// 2️⃣ import the tldraw plugin
import {tldraw} from 'sanity-plugin-tldraw'

export default defineConfig({
  // ... other config
  plugins: [
    // ... other plugins
    // 3️⃣ add the tldraw plugin
    tldraw(),
  ],
})
```

Then add it as a field in your schema types

```ts
export const postType = defineType({
  name: 'post',
  title: 'Post',
  fields: [
    // ... other fields
    defineField({
      name: 'drawing',
      // 👇 this `type` is what the plugin creates
      type: 'tldraw',
      options: {
        // 👇 optional: set the height of the canvas
        height: 400,
      },
    }),
  ],
})
```

The `tldraw` schema type is an object with two fields:

- `document`, stringified JSON of the drawing, this needs to be parsed when rendered into your front end.
- `sessions`, an array of stringified JSON saving the state of each user that interacts with the drawing, so that their position is synced across browsers and saved for when they return.

### Render in your front end

When querying on your front end, you likely only need the `document` field.

```
*[_type == "post"]{
  title,
  "drawing": drawing.document
}
```

Install the tldraw SDK for your front end.

```sh
npm i tldraw
```

And render the drawing using the `TldrawImage` component

```tsx
import {TldrawImage} from 'tldraw'

export function Post({title, drawing}) {
  return (
    <div>
      <h1>{title}</h1>
      <TldrawImage document={JSON.parse(drawing)} />
    </div>
  )
}
```

## License

[MIT](LICENSE) © Simeon Griggs

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/SimeonGriggs/sanity-plugin-tldraw/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
