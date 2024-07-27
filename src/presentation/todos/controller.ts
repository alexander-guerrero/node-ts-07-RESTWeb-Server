import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';

const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() }
];

export class TodosController {

    // Dependency Injection 
    constructor() {}

    public getTodos = (req: Request, res: Response) => {
        return res.json(todos);
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = todos.find(todo => todo.id === id);
        ( todo ) 
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` })
    }
    
    public createTodo = async (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Text property is required' });

        const newTodo = await prisma.todo.create({
            data: { text }
        });

        res.json(newTodo);
    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = todos.find(todo => todo.id === id);
        if ( !todo ) return res.status(404).json({ error: `TODO with id ${id} not found` });

        const { text, completedAt } = req.body;
        // if (!text) return res.status(400).json({ error: 'Text property is required' });

        todo.text = text || todo.text;
        ( completedAt === 'null' ) 
            ? todo.completedAt = null
            : todo.completedAt = new Date( completedAt || todo.completedAt );

        res.json(todo);
    }

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = todos.find(todo => todo.id === id);
        if ( !todo ) return res.status(404).json({ error: `TODO with id ${id} not found` });

        todos.splice(todos.indexOf(todo), 1);
        res.json(todo);
    }

}
