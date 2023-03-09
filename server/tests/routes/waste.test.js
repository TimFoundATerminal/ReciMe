const request = require('supertest')
const app = require('../../app')

describe('Get /waste', () => {
  it('should get all waste logs', async () => {
    const res = await request(app)
      .get('/api/waste')
    expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    expect(res.statusCode).toEqual(200)
  })
})

describe('Get /waste/carbonTotal', () => {
  it('should get the carbon wasted total', async () => {
    const res = await request(app)
      .get('/api/waste/carbonTotal')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('total')
  })
})

describe('Get /waste/{id}', () => {
  it('should get waste log', async () => {
    const res = await request(app)
      .get('/api/waste/1')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ wasteID: 1, ingredientID: 2, dateThrownAway: 20230111, quantity: 0.4, carbonWasted: 15.68, name: 'Lamb', standardUnit: 'kg', carbonPerUnit: 39.2 })
  })
})

describe('Post /waste', () => {
  it('should add a new waste log', async () => {
    const res = await request(app)
      .post('/api/waste')
      .send({
        ingredientID: 1,
        dateThrownAway: 20230226,
        quantity: 50.5
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'Waste log created successfully' })
  })
})

describe('Delete /waste/{id}', () => {
  it('should delete a waste log', async () => {
    const res = await request(app)
      .delete('/api/waste/1')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'Waste log deleted successfully' })
  })
})
