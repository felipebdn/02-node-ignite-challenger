import fastify from 'fastify'
import { snacksRoutes } from './routes/snacks'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(snacksRoutes, {
  prefix: 'snacks',
})
