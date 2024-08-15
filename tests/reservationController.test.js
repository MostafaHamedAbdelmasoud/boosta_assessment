const request = require('supertest');
const {app} =  require('../serverTest.js'); 
const { sequelize } = require('../src/DB/connection'); 
const bookModel = require('../src/DB/models/Book.model.js'); 
const reservationModel = require('../src/DB/models/Reservation.model.js'); 
const borrowernModel = require('../src/DB/models/Borrower.model.js'); 
const redisClient = require('../src/DB/redis.js'); 

jest.mock('../src/DB/models/Book.model.js');
jest.mock('../src/DB/models/Reservation.model.js');
jest.mock('../src/DB/models/Borrower.model.js');
jest.mock('../src/DB/redis');

let server;
describe('Reservation Controller', () => {

  beforeAll(async () => {

    const port =  5000; 
     app.listen(port, () => {
      console.log(`Test server running on port ${port}`);
    });
  });

  afterAll(async () => {
    // await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a reservation successfully', async () => {
    const book = { id: 1, available_quantity: 5, update: jest.fn() };
    const newReservation = { id: 1, book_id: 1 };

    bookModel.findByPk.mockResolvedValue(book);
    reservationModel.create.mockResolvedValue(newReservation);
    redisClient.setNewDataInRedis.mockResolvedValue();
    redisClient.updateOneRecordInRedis.mockResolvedValue();

    const response = await request(app)
      .post('/reservations')
      .send({ book_id: 1, user_id: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Created',
      id: newReservation.id,
    });
    expect(book.update).toHaveBeenCalledWith(
      { available_quantity: book.available_quantity - 1 },
      expect.any(Object)
    );
  });

  test('should return 400 if book is not available', async () => {
    const book = { id: 1, available_quantity: 0 };

    bookModel.findByPk.mockResolvedValue(book);

    const response = await request(app)
      .post('/reservations')
      .send({ book_id: 1, user_id: 1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad Request');
  });

  test('should rollback transaction on failure', async () => {
    const book = { id: 1, available_quantity: 5, update: jest.fn() };
    const t = { rollback: jest.fn(), commit: jest.fn() };

    bookModel.findByPk.mockResolvedValue(book);
    reservationModel.create.mockRejectedValue(new Error('Database Error'));
    sequelize.transaction.mockResolvedValue(t);

    const response = await request(app)
      .post('/reservations')
      .send({ book_id: 1, user_id: 1 });

    expect(response.status).toBe(500);
    expect(t.rollback).toHaveBeenCalled();
  });
});