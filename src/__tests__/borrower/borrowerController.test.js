const request = require('supertest');
const app = require('../../../server'); // Adjust the path to your app
const BorrowerController = require('./src/modules/borrower/controller/borrower.controller');

jest.mock('../../modules/borrower/controller/borrower.controller.js');

describe('BorrowerController Endpoints', () => {
  describe('createBorrower', () => {
    it('should create a new borrower successfully', async () => {
      const mockResponse = {
        message: "borrower created successfully",
        id: 1,
        token: "sampleToken"
      };
      BorrowerController.createBorrower.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/borrower')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    // it('should return 409 if email already exists', async () => {
    //   const mockError = new Error('email already exist');
    //   mockError.cause = 409;
    //   BorrowerController.createBorrower.mockRejectedValue(mockError);

    //   const response = await request(app)
    //     .post('/borrower')
    //     .send({ email: 'existing@example.com', password: 'password123' });

    //   expect(response.status).toBe(409);
    //   expect(response.body).toEqual({ message: 'email already exist' });
    // });

    // it('should handle internal server error', async () => {
    //   const mockError = new Error('Internal Error');
    //   BorrowerController.createBorrower.mockRejectedValue(mockError);

    //   const response = await request(app)
    //     .post('/borrower')
    //     .send({ email: 'test@example.com', password: 'password123' });

    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ message: 'Internal Error' });
    // });
  });

//   describe('updateBorrower', () => {
//     it('should update borrower successfully', async () => {
//       const mockResponse = { message: "done", data: { id: 1, name: 'Updated Name' } };
//       BorrowerController.updateBorrower.mockResolvedValue(mockResponse);

//       const response = await request(app)
//         .put('/borrower/1')
//         .send({ name: 'Updated Name' });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockResponse);
//     });

//     it('should return 404 if borrower not found', async () => {
//       const mockError = new Error('borrower not found');
//       mockError.cause = 404;
//       BorrowerController.updateBorrower.mockRejectedValue(mockError);

//       const response = await request(app)
//         .put('/borrower/999')
//         .send({ name: 'Updated Name' });

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({ message: 'borrower not found' });
//     });

//     it('should handle unique constraint error', async () => {
//       const mockError = new Error('Unique constraint error');
//       BorrowerController.updateBorrower.mockRejectedValue(mockError);

//       const response = await request(app)
//         .put('/borrower/1')
//         .send({ email: 'duplicate@example.com' });

//       expect(response.status).toBe(409);
//       expect(response.body).toEqual({ message: 'Unique constraint error' });
//     });
//   });

//   describe('getBorrowers', () => {
//     it('should fetch borrowers with pagination', async () => {
//       const mockResponse = {
//         message: "done",
//         data: [{ id: 1, name: 'John Doe', email: 'john@example.com' }]
//       };
//       BorrowerController.getBorrowers.mockResolvedValue(mockResponse);

//       const response = await request(app)
//         .get('/borrowers?page=1&limit=10');

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockResponse);
//     });
//   });

//   describe('me', () => {
//     it('should fetch current user data', async () => {
//       const mockResponse = {
//         message: "done",
//         data: { id: 1, name: 'John Doe', email: 'john@example.com' }
//       };
//       BorrowerController.me.mockResolvedValue(mockResponse);

//       const response = await request(app)
//         .get('/me');

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockResponse);
//     });
//   });

//   describe('deleteBorrower', () => {
//     it('should delete borrower successfully', async () => {
//       const mockResponse = {
//         message: "done",
//         data: "Borrower deleted Successfully"
//       };
//       BorrowerController.deleteBorrower.mockResolvedValue(mockResponse);

//       const response = await request(app)
//         .delete('/borrower')
//         .send({ id: 1 });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockResponse);
//     });

//     it('should return 404 if borrower not found', async () => {
//       const mockError = new Error('borrower not found');
//       mockError.cause = 404;
//       BorrowerController.deleteBorrower.mockRejectedValue(mockError);

//       const response = await request(app)
//         .delete('/borrower')
//         .send({ id: 999 });

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({ message: 'borrower not found' });
//     });

//     it('should handle failed deletion', async () => {
//       const mockError = new Error('failed to delete borrower');
//       mockError.cause = 400;
//       BorrowerController.deleteBorrower.mockRejectedValue(mockError);

//       const response = await request(app)
//         .delete('/borrower')
//         .send({ id: 1 });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ message: 'failed to delete borrower' });
//     });
//   });
});