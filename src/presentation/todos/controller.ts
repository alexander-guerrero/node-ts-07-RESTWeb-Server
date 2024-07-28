import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {

    // Dependency Injection 
    constructor() {}

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findUnique({
            where: { id }
        });
        
        ( todo ) 
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` })
        
    }
    
    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body)
        if (error) return res.status(400).json({ error });

        const newTodo = await prisma.todo.create({
            data: createTodoDto! // Con "!" se indica al compilador que "createTodoDto" no puede ser "null" o "undefined"
        });

        res.json(newTodo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ id, ...req.body });
        if (error) return res.status(400).json({ error });

        const todo = await prisma.todo.findUnique({
            where: { id }
        });
        if ( !todo ) return res.status(404).json({ error: `TODO with id ${id} not found` });

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });

        res.json(updatedTodo);
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findUnique({
            where: { id }
        });
        if ( !todo ) return res.status(404).json({ error: `TODO with id ${id} not found` });

        const deletedTodo = await prisma.todo.delete({
            where: { id }
        });

        res.json(deletedTodo);
    }

}
