const request = require('supertest')
const app = require('../../app')

/*
---------------------------
Test /ingredients endpoints
---------------------------
*/

describe('Get /ingredients', () => {
  it('should get all ingredients', async () => {
    const res = await request(app)
      .get('/api/ingredients')
    expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    expect(res.statusCode).toEqual(200)
  })
})

describe('Get /ingredients/{id}', () => {
    it('should get all ingredients', async () => {
      const res = await request(app)
        .get('/api/ingredients/1')
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({"ingredientID":1,"name":"Chicken","standardUnit":"kg","carbonPerUnit":6.9})
    })
  })

describe('Post /ingredients', () => {
  it('should add a new ingredient', async () => {
    const res = await request(app)
      .post('/api/ingredients')
      .send({
        name: "Test ingredient",
        standardUnit: "grams",
        carbonPerUnit: 20
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"message": "Ingredient created successfully"})
  })
})

describe('Delete /ingredients/{id}' , () => {
  it('should delete an ingredient', async () => {
    const res = await request(app)
      .delete('/api/ingredients/37')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"message": "ingredient deleted successfully"})
  })
})