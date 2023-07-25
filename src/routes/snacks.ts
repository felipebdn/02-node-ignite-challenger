import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import knex from 'knex'
import { z } from 'zod'

export async function snacksRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const snacksSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
    })
    console.log(req.body)

    const { description, isOnDiet, name } = snacksSchema.parse(req.body)

    await knex('snacks').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
    })

    return res.status(201).send()
  })
}
