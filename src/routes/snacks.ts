import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function snacksRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const snacksSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
    })

    const { description, isOnDiet, name } = snacksSchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
    }

    await knex('snacks').insert({
      id: randomUUID(),
      name,
      is_on_diet: isOnDiet ? 1 : 0,
      description,
      session_id: sessionId,
    })

    return res.status(201).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const sessionId = req.cookies.sessionId
      const snacks = await knex('snacks')
        .select()
        .where('session_id', sessionId)
      return snacks
    },
  )
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const getSnackParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getSnackParamsSchema.parse(req.params)

      const sessionId = req.cookies.sessionId
      const snack = await knex('snacks')
        .select('*')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return snack
    },
  )
}
