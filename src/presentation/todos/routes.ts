import { Router } from 'express';
import { TodosController } from './controller';

export class TodosRoutes {

    static get routes(): Router {

        const router = Router();
        const todoController = new TodosController();

        router.get('/', 
            // (req, res) => todoController.getTodos(req, res)
            todoController.getTodos // En JavaScript se puede abreviar, son equivalentes
        );
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createTodo);
        router.put('/:id', todoController.updateTodo);

        return router;

    }

}
