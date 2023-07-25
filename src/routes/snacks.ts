import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function snacksRoutes(app: FastifyInstance) {
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
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const sessionId = req.cookies.sessionId
      const snacks = await knex('snacks')
        .select()
        .where('session_id', sessionId)

      const totalInDiet = snacks.filter((snack) => {
        return snack.is_on_diet === 1
      }).length
      const totalOutDiet = snacks.filter((snack) => {
        return snack.is_on_diet !== 1
      }).length
      const result = snacks.reduce(
        (acc, snack) => {
          if (snack.is_on_diet === 1) {
            acc.currentLength++
          } else {
            if (acc.currentLength > acc.maxLength) {
              acc.maxLength = acc.currentLength
            }
            acc.currentLength = 0
          }
          return acc
        },
        { currentLength: 0, maxLength: 0 },
      )
      if (result.currentLength > result.maxLength) {
        result.maxLength = result.currentLength
      }

      return {
        total_meals: snacks.length,
        total_meals_in_diet: totalInDiet,
        total_meals_out_diet: totalOutDiet,
        sequence_meals_with_diet: result.maxLength,
      }
    },
  )
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
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
      created_at: String(new Date()),
    })
    return res.status(201).send()
  })
  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const snacksSchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
      })
      const getSnackParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getSnackParamsSchema.parse(req.params)
      const { description, isOnDiet, name } = snacksSchema.parse(req.body)
      const sessionId = req.cookies.sessionId
      await knex('snacks')
        .update({
          name,
          description,
          is_on_diet: isOnDiet ? 1 : 0,
          created_at: String(new Date()),
        })
        .where({
          id,
          session_id: sessionId,
        })

      return res.status(201).send()
    },
  )
  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const getSnackParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getSnackParamsSchema.parse(req.params)
      await knex('snacks').where('id', id).del()
      return res.status(201).send()
    },
  )
}
