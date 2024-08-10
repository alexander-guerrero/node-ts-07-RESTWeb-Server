import { Request, Response } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from '../../domain';

export class TodosController {

    // Dependency Injection 
    constructor(
        private readonly todoRepository: TodoRepository
    ) {}

    public getTodos = (req: Request, res: Response) => {
        new GetTodos(this.todoRepository)
            .execute()
            .then( todos => res.json(todos) )
            .catch( error => res.status(400).json({error}) );
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;

        new GetTodo(this.todoRepository)
            .execute(id)
            .then( todo => res.json(todo) )
            .catch( error => res.status(400).json({error}) );

        // Al no tener return se podría seguir ejecutando código luego del try...catch
        
    }
    
    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body)
        if (error) return res.status(400).json({ error });

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!) // Con "!" se indica al compilador que "createTodoDto" no puede ser "null" o "undefined"
            .then( newTodo => res.json(newTodo) )
            .catch( error => res.status(400).json({error}) );

    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id }); // El orden importa, primero el spread operator, y luego el id original del Path que reemplaza a cualquier otro id que se haya enviado en el Body
        if (error) return res.status(400).json({ error });

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then( updatedTodo => res.json(updatedTodo) )
            .catch( error => res.status(400).json({error}) );

    }

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then( deletedTodo => res.json(deletedTodo) )
            .catch( error => res.status(400).json({error}) );

    }

}
