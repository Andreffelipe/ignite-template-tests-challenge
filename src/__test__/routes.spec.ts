import request from 'supertest';
import { app } from '../app';
import { Connection, createConnection } from 'typeorm';
let connection: Connection;
describe('fin Api', () => {
  jest.setTimeout(50000)
  let JWT: string
  let statement_id: string

  beforeAll(async () => {
    connection = await createConnection();

  });

  afterAll(async () => {
    await connection.close();
    jest.clearAllTimers()
  });
  it('should return new user', async (done) => {
    request(app)
      .post('/api/v1/users')
      .send({ name: 'Andre', email: 'andre@email.com', password: 'hard_password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
  it('should return error when user already exists', (done) => {
    request(app)
      .post('/api/v1/users')
      .send({ name: 'Andre', email: 'andre@email.com', password: 'hard_password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toEqual({ "message": "User already exists" })
        return done();
      });
  });

  it('should return error when user already exists', async () => {
    const result = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'andre@email.com', password: 'hard_password' })
    JWT = result.body.token
    expect(result.body.user).toMatchObject({ name: 'Andre', email: 'andre@email.com' })
  });

  it('should deposit the amount without error', (done) => {
    request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 100, description: "salario" })
      .set('authorization', `Bearer ${JWT}`)
      .expect(201)
      .end(function (err, res) {
        statement_id = res.body.id
        done()
      })
  });

  it('should return a list of user account transactions', async () => {
    const result = await request(app)
      .get('/api/v1/statements/balance')
      .set('authorization', `Bearer ${JWT}`)

    expect(result.body.balance).toEqual(100)
    expect(result.body.statement[0]).toMatchObject({
      type: 'deposit',
      amount: 100,
      description: 'salario'
    })
  });


  it('should return a user account transactions', async () => {
    const result = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set('authorization', `Bearer ${JWT}`)

    expect(result.body).toMatchObject({
      type: 'deposit',
      amount: '100.00',
      description: 'salario'
    })
  });


  it('should return the registered withdrawal information if there is a balance', async () => {
    const result = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({ amount: 100, description: "salario" })
      .set('authorization', `Bearer ${JWT}`)
    expect(result.body).toMatchObject({
      type: 'withdraw',
      amount: 100,
      description: 'salario'
    })
  });

  it('should return an error when there is no balance to withdraw', (done) => {
    request(app)
      .post('/api/v1/statements/withdraw')
      .send({ amount: 100, description: "salario" })
      .set('authorization', `Bearer ${JWT}`)
      .expect(400)
      .end(function (err, res) {
        expect(res.body).toEqual({ "message": "Insufficient funds" })
        done()
      })
  });
});
