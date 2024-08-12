import request from 'supertest';
import { testServer } from '../../test-server';

describe('Testing routes.ts', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });
    
    test('should return TODOs api/todos', async () => {
        
        const response = await request(testServer.app)
            .get('/api/todos')
            .expect(200);
        
        console.log(response.body);

    });

});
