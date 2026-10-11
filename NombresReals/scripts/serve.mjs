import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

const root = resolve('out')
const port = Number(process.env.PORT || 3000)
const types = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
}

createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end()
    return
  }

  let path
  try {
    const url = new URL(request.url, 'http://localhost')
    path = resolve(root, `.${decodeURIComponent(url.pathname)}`)
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Invalid path')
    if (url.pathname.endsWith('/')) path = resolve(path, 'index.html')
    const info = await stat(path)
    if (info.isDirectory()) path = resolve(path, 'index.html')
    await stat(path)
  } catch {
    response.writeHead(404).end('Pàgina no trobada')
    return
  }

  response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' })
  if (request.method === 'HEAD') response.end()
  else createReadStream(path).pipe(response)
}).listen(port, () => console.log(`Pàgina disponible a http://localhost:${port}`))
