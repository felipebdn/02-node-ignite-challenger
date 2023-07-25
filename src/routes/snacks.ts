import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function snacksRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const snacksSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
    })

    const { description, isOnDiet, name } = snacksSchema.parse(req.body)

    await knex('snacks').insert({
      id: randomUUID(),
      name,
      is_on_diet: isOnDiet ? 1 : 0,
      description,
    })

    return res.status(201).send()
  })

  app.get('/', async () => {
    const snacks = knex('snacks').select()
    return snacks
  })
  app.get('/:id', async (req) => {
    const getSnackParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getSnackParamsSchema.parse(req.params)
    const snacks = knex('snacks').select('*').where('id', id)
    return snacks
  })
}
