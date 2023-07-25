import fastify from 'fastify'
import { env } from './env'
import { snacksRoutes } from './routes/snacks'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app.register(snacksRoutes, {
  prefix: 'snacks',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
