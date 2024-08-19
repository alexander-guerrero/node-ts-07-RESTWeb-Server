import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Testing routes.ts', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    });

    const todo1 = { text: 'Hello world! 1' };
    const todo2 = { text: 'Hello world! 2' };
    
    test('should return TODOs api/todos', async () => {

        await prisma.todo.createMany({
            data: [todo1, todo2]
        });
        
        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);
        
        // console.log(body);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
        expect(body[0].completedAt).toBeNull();

    });
    
    test('should return a TODO api/todos/:id', async () => {

        // 1. Arrange
        const newTodo = await prisma.todo.create({
            data: todo1
        });

        // 2. Act
        const { body } = await request(testServer.app)
            .get(`/api/todos/${newTodo.id}`)
            .expect(200)

        // 3. Assert
        expect(body).toEqual({
            id: newTodo.id,
            text: newTodo.text,
            completedAt: newTodo.completedAt
        });

    });

    test('should return Not Found api/todos/:id', async () => {

        // 1. Arrange
        const deletedId = 0;

        // 2. Act
        const { body } = await request(testServer.app)
            .get(`/api/todos/${deletedId}`)
            .expect(400)

        // 3. Assert
        expect(body).toEqual({
            error: `Todo with id ${deletedId} not found`
        });

    });

    test('should return a new TODO api/todos', async () => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201)

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });

    });

    test('should return an error if "text" field is not present when POST api/todos', async () => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({  })
            .expect(400)

        expect(body).toEqual({
            error: 'Text property is required'
        });

    });

    test('should return an error if "text" field is empty when POST api/todos', async () => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({ text: '' })
            .expect(400)

        expect(body).toEqual({
            error: 'Text property is required'
        });

    });

    test('should return an updated TODO api/todos/:id', async () => {

        const newTodo = await prisma.todo.create({
            data: todo1
        });
        const todoToUpdate = {
            text: 'Hello UPDATE! :D',
            completedAt: '2024-08-18'
        }

        const { body } = await request(testServer.app)
            .put(`/api/todos/${newTodo.id}`)
            .send(todoToUpdate)
            .expect(200)

        expect(body).toEqual({
            id: newTodo.id,
            text: todoToUpdate.text,
            completedAt: '2024-08-18T00:00:00.000Z'
        });

    });

    // Tarea:
    // should return 404 if TODO not found
    // should return an updated TODO only the date

});
