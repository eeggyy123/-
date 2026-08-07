import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

const githubPagesAssetPrefix = (enabled: boolean): Plugin => ({
  name: 'github-pages-public-asset-prefix',
  enforce: 'pre',
  transform(code, id) {
    if (!enabled || !id.includes('/src/')) return null

    const transformed = code.replace(
      /(["'`])\/(images|music|videos)\//g,
      '$1/-/$2/',
    )

    return transformed === code ? null : { code: transformed, map: null }
  },
})

// GitHub Pages hosts this repository at /-/. Local development remains at /.
export default defineConfig(({ mode }) => {
  const isGithubPages = mode === 'github-pages'

  return {
    base: isGithubPages ? '/-/' : '/',
    build: {
      sourcemap: 'hidden',
    },
    plugins: [
      githubPagesAssetPrefix(isGithubPages),
      react({
        babel: {
          plugins: [
            'react-dev-locator',
          ],
        },
      }),
      tsconfigPaths()
    ],
  }
})
