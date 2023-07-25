import { it, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})
afterAll(async () => {
  await app.close()
})

it('Deve ser possível registrar uma refeição feita', async () => {
  await request(app.server)
    .post('/snacks')
    .send({
      name: 'Janta',
      description: 'Arroz, feijão e carne',
      isOnDiet: true,
    })
    .expect(201)
})
