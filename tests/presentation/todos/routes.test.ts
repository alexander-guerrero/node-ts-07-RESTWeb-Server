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

    const todo1 = { text: 'Hello world! 1' };
    const todo2 = { text: 'Hello world! 2' };
    
    test('should return TODOs api/todos', async () => {

        await prisma.todo.deleteMany();
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

});
