const request = require('supertest')
const app = require('../../app')

describe('Get /pantry', () => {
  it('should get all pantry items', async () => {
    const res = await request(app)
      .get('/api/pantry')
    expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    expect(res.statusCode).toEqual(200)
  })
})

describe('Get /pantry/{id}', () => {
  it('should get specific pantry item', async () => {
    const res = await request(app)
      .get('/api/pantry/1')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ itemID: 1, ingredientID: 3, quantity: 0.4, dateExpiry: 20230312, frozen: 0, name: 'Beef', standardUnit: 'kg', carbonPerUnit: 27 })
  })
})

describe('Post /pantry', () => {
  it('should add a new ingredient', async () => {
    const res = await request(app)
      .post('/api/pantry')
      .send({
        ingredientID: 1,
        quantity: 100,
        dateExpiry: 20230224,
        frozen: 1
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'Pantry item created successfully' })
  })
})

describe('Delete /pantry/{id}', () => {
  it('should delete an ingredient', async () => {
    const res = await request(app)
      .delete('/api/pantry/2')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'Pantry item deleted successfully' })
  })
})

describe('Put /pantry/{id}', () => {
  it('should update a pantry item', async () => {
    const res = await request(app)
      .put('/api/pantry/1')
      .send({
        ingredientID: 2,
        quantity: 50,
        dateExpiry: 20230223,
        frozen: 0
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'Pantry item updated successfully' })
  })
})
