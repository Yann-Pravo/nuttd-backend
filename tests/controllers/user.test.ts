import request from 'supertest';
import express from 'express';
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    createUserProfile,
    getUserWithProfile,
    getUserNuts,
} from '../../src/controllers/user';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
app.get('/api/users', getUsers);
app.get('/api/users/:userID', getUser);
app.post('/api/users', createUser);
app.put('/api/users/:userID', updateUser);
app.delete('/api/users/:userID', deleteUser);
app.post('/api/users/:userID/profile', createUserProfile);
app.get('/api/users/:userID/profile', getUserWithProfile);
app.get('/api/users/:userID/nuts', getUserNuts);

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
      user: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
      },
      profile: {
          create: jest.fn(),
      },
      nut: {
          findMany: jest.fn(),
      },
  };
  return {
      PrismaClient: jest.fn(() => mPrismaClient),
  };
});

describe('User Controller', () => {
  let prismaClient: any;
  const createdUser = { id: '1', email: 'john@example.com', username: 'john_doe' };

  beforeAll(() => {
      prismaClient = new PrismaClient();
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users with status 200', async () => {
      const users = [createdUser];
      prismaClient.user.findMany.mockResolvedValue(users);
  
      const response = await request(app).get('/api/users');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ result: users });
      expect(prismaClient.user.findMany).toHaveBeenCalled();
    });
  
    it('should return 200 with empty array if no users', async () => {
      prismaClient.user.findMany.mockResolvedValue([]);
  
      const response = await request(app).get('/api/users');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ result: [] });
      expect(prismaClient.user.findMany).toHaveBeenCalled();
    });
  });
  
  describe('GET /api/users/:userID', () => {
    it('should return a user by id with status 200', async () => {
      const userID = '1';
      prismaClient.user.findUnique.mockResolvedValue(createdUser);
  
      const response = await request(app).get(`/api/users/${userID}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ result: createdUser });
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: userID } });
    });
  
    it('should return 404 if user not found', async () => {
      const userID = '2';
      prismaClient.user.findUnique.mockResolvedValue(null);
  
      const response = await request(app).get(`/api/users/${userID}`);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ msg: 'User not found' });
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: userID } });
    });
  });
  
  describe('POST /api/users', () => {
    it('should create a new user with status 200', async () => {
      prismaClient.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
          .post('/api/users')
          .send({ email: 'john@example.com', username: 'john_doe', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ result: createdUser });
      expect(prismaClient.user.create).toHaveBeenCalledWith({
          data: { email: 'john@example.com', username: 'john_doe', password: 'password' },
      });
    });
  
    it('should return 500 if there is an error creating user', async () => {
      prismaClient.user.create.mockRejectedValue('Creation error');
  
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'john@example.com', username: 'john_doe' });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ msg: 'Creation error' });
    });
  });

  describe('PUT /api/users/:userID', () => {
    it('should update a user with status 200', async () => {
      const userID = '1';
      const updatedData = { email: 'updated@example.com', username: 'updated_user' };
      prismaClient.user.update.mockResolvedValue(createdUser);
  
      const response = await request(app)
        .put(`/api/users/${userID}`)
        .send(updatedData);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ result: createdUser });
      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: userID },
        data: updatedData,
      });
    });
  
    it('should return 404 if userID is not provided', async () => {
      const response = await request(app)
        .put(`/api/users/`)
        .send({ email: 'updated@example.com', username: 'updated_user' });
  
      expect(response.status).toBe(404); // Since the route would not match without userID, status will be 404
    });
  
    it('should return 500 if there is an error updating the user', async () => {
      const userID = '1';
      prismaClient.user.update.mockRejectedValue('Update error');
  
      const response = await request(app)
        .put(`/api/users/${userID}`)
        .send({ email: 'updated@example.com', username: 'updated_user' });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ msg: 'Update error' });
    });
  });

  describe('DELETE /api/users/:userID', () => {
    it('should delete a user from the database', async () => {
      // Create a user to be deleted
      prismaClient.user.delete.mockResolvedValue(createdUser);
  
      const response = await request(app)
        .delete(`/api/users/${createdUser.id}`)
        .send();
  
      expect(response.status).toBe(200);
  
      // Verify that the user was deleted
      const deletedUser = await prismaClient.user.findUnique({
        where: { id: createdUser.id },
      });
  
      expect(deletedUser).toBeNull();
    });
  
    it('should return 404 if the user does not exist', async () => {
      const nonExistentUserID = 'non-existent-id';

      prismaClient.user.delete.mockRejectedValue();
  
      const response = await request(app)
        .delete(`/api/users/${nonExistentUserID}`)
        .send();
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ msg: 'User not found' });
    });
  
    it('should return 404 if userID is not provided', async () => {
      const response = await request(app)
        .delete('/api/users/')
        .send();
  
      expect(response.status).toBe(404);
    });
  })
})