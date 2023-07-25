import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('snack routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('yarn knex migrate:rollback --all')
    execSync('yarn knex migrate:latest')
  })

  it('must be possible to register a new meal made', async () => {
    await request(app.server)
      .post('/snacks')
      .send({
        name: 'Janta',
        description: 'Arroz, feijão e carne',
        isOnDiet: true,
      })
      .expect(201)
  })
  it('should be possible to list all meals eaten', async () => {
    const createSnackResponse = await request(app.server).post('/snacks').send({
      name: 'Janta',
      description: 'Arroz, feijão e carne',
      isOnDiet: true,
    })
    const cookie = createSnackResponse.get('Set-Cookie')
    const listSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookie)
      .expect(200)
    expect(listSnacksResponse.body).toEqual([
      expect.objectContaining({
        name: 'Janta',
        description: 'Arroz, feijão e carne',
      }),
    ])
  })
  it('should be possible to show a specific meal', async () => {
    const createSnackResponse = await request(app.server).post('/snacks').send({
      name: 'Janta',
      description: 'Arroz, feijão e carne',
      isOnDiet: true,
    })
    const cookie = createSnackResponse.get('Set-Cookie')
    await request(app.server).post('/snacks').set('Cookie', cookie).send({
      name: 'Almoço',
      description: 'Hamburguer',
      isOnDiet: false,
    })
    const listSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookie)
      .expect(200)
    const id = listSnacksResponse.body[0].id
    const getSnackResponse = await request(app.server)
      .get(`/snacks/${id}`)
      .set('Cookie', cookie)
      .expect(200)
    expect(getSnackResponse.body).toEqual(
      expect.objectContaining({
        name: 'Janta',
        description: 'Arroz, feijão e carne',
      }),
    )
  })
  it('should be possible to upgrade a meal made', async () => {
    const createSnackResponse = await request(app.server).post('/snacks').send({
      name: 'Janta',
      description: 'Arroz, feijão e carne',
      isOnDiet: true,
    })
    const cookie = createSnackResponse.get('Set-Cookie')
    const listSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookie)
    const id = listSnacksResponse.body[0].id
    await request(app.server)
      .put(`/snacks/${id}`)
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão e carne',
        isOnDiet: false,
      })
      .expect(201)
  })
  it('should be possible to delete a meal made', async () => {
    const createSnackResponse = await request(app.server).post('/snacks').send({
      name: 'Janta',
      description: 'Arroz, feijão e carne',
      isOnDiet: true,
    })
    const cookie = createSnackResponse.get('Set-Cookie')
    const listSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookie)
    const id = listSnacksResponse.body[0].id
    await request(app.server)
      .delete(`/snacks/${id}`)
      .set('Cookie', cookie)
      .expect(201)
  })
  it('should be possible to retrieve the statistics of the meals made', async () => {
    const createNewSnack = await request(app.server)
      .post('/snacks')
      .send({
        name: 'Janta',
        description: 'Arroz, feijão e carne',
        isOnDiet: true,
      })
      .expect(201)
    const cookie = createNewSnack.get('Set-Cookie')
    for (let i = 0; i < 7; i++) {
      await request(app.server)
        .post('/snacks')
        .set('Cookie', cookie)
        .send({
          name: 'Janta',
          description: 'Arroz, feijão e carne',
          isOnDiet: !(i === 5 || i === 0),
        })
        .expect(201)
    }
    const getMetricsResponse = await request(app.server)
      .get('/snacks/metrics')
      .set('Cookie', cookie)
      .expect(200)
    expect(getMetricsResponse.body).toEqual({
      total_meals: 8,
      total_meals_in_diet: 6,
      total_meals_out_diet: 2,
      sequence_meals_with_diet: 4,
    })
  })
})
