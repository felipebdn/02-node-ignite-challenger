import fastify from 'fastify'
import { env } from './env'
import { snacksRoutes } from './routes/snacks'

const app = fastify()

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
