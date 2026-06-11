import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer(root = process.cwd()) {
  const app = express()
  const resolve = (p) => path.resolve(__dirname, p)

  let vite
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(resolve('dist/client'), { index: false }))
    const { render } = await import(pathToFileURL(resolve('dist/server/entry-server.js')).href)
    app.use(async (req, res) => {
      try {
        const url = req.originalUrl
        const { html: appHtml, ssrData } = await render(url)
        const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        const html = template
          .replace('<!--ssr-outlet-->', appHtml)
          .replace(
            '</head>',
            `<script>window.__SSR_DATA__ = ${JSON.stringify(ssrData)}</script>\n</head>`
          )
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (e) {
        console.error(e)
        res.status(500).end(e.message || 'SSR error')
      }
    })
  } else {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
    app.use(async (req, res) => {
      try {
        const url = req.originalUrl
        const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
        const { html: appHtml, ssrData } = await render(url)
        const template = fs.readFileSync(resolve('index.html'), 'utf-8')
        const html = await vite.transformIndexHtml(url, template)
          .then((r) => r.replace('<!--ssr-outlet-->', appHtml))
        const finalHtml = html.replace(
          '</head>',
          `<script>window.__SSR_DATA__ = ${JSON.stringify(ssrData)}</script>\n</head>`
        )
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
      } catch (e) {
        vite?.ssrFixStacktrace?.(e)
        console.error(e)
        res.status(500).end(e.message || 'SSR error')
      }
    })
  }

  return { app, vite }
}

createServer().then(({ app }) => {
  const port = process.env.PORT || 5173
  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`)
  })
})
