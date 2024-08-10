import { Router } from 'express';
import { TodosController } from './controller';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl';
import { TodoDatasourceImpl } from '../../infrastructure/datasources/todo.datasource.impl';

export class TodosRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new TodoDatasourceImpl(); // datasource de PostgreSQL (prisma)
        const todoRepositoryImpl = new TodoRepositoryImpl(datasource);
        const todoController = new TodosController(todoRepositoryImpl);

        router.get('/', 
            // (req, res) => todoController.getTodos(req, res)
            todoController.getTodos // En JavaScript se puede abreviar, son equivalentes
        );
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createTodo);
        router.put('/:id', todoController.updateTodo);
        router.delete('/:id', todoController.deleteTodo);

        return router;

    }

}
