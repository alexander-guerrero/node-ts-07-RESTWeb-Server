import { Request, Response } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoRepository } from '../../domain';

export class TodosController {

    // Dependency Injection 
    constructor(
        private readonly todoRepository: TodoRepository
    ) {}

    public getTodos = async (req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const todo = await this.todoRepository.findById(id);
            res.json(todo);
        } catch (error) {
            res.status(404).json({ error });
        }

        // Al no tener return se podría seguir ejecutando código luego del try...catch
        
    }
    
    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body)
        if (error) return res.status(400).json({ error });

        const newTodo = await this.todoRepository.create(createTodoDto!); // Con "!" se indica al compilador que "createTodoDto" no puede ser "null" o "undefined"

        res.json(newTodo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id }); // El orden importa, primero el spread operator, y luego el id original del Path que reemplaza a cualquier otro id que se haya enviado en el Body
        if (error) return res.status(400).json({ error });

        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!)

        res.json(updatedTodo);
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;

        const deletedTodo = await this.todoRepository.deleteById(id);

        res.json(deletedTodo);
    }

}
