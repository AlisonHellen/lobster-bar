import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'skill-md-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0]
          
          // /skill.md -> /skill/SKILL.md
          if (url === '/skill.md') {
            try {
              const content = readFileSync(join(__dirname, 'skill', 'SKILL.md'), 'utf-8')
              res.setHeader('Content-Type', 'text/plain; charset=utf-8')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(content)
            } catch (e) {
              res.statusCode = 404
              res.end('Not found')
            }
            return
          }
          
          // /skill/xxx -> skill/xxx
          if (url.startsWith('/skill/')) {
            const fileName = url.replace(/^\/skill\//, '')
            const filePath = join(__dirname, 'skill', fileName)
            
            try {
              const content = readFileSync(filePath)
              const ext = fileName.split('.').pop().toLowerCase()
              if (ext === 'md') {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8')
              } else if (ext === 'js') {
                res.setHeader('Content-Type', 'application/javascript')
              } else if (ext === 'json') {
                res.setHeader('Content-Type', 'application/json')
              }
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(content)
            } catch (e) {
              res.statusCode = 404
              res.end('Not found: ' + fileName)
            }
            return
          }
          
          next()
        })
      }
    }
  ],
  server: {
    historyApiFallback: true,
  },
  assetsInclude: ['**/*.md'],
})
