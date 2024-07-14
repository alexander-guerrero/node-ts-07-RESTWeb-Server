import express from 'express';
import path from 'path';

interface Options {
    port: number;
    publicPath?: string;
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;

    constructor(options: Options) {
        const { port, publicPath = 'public' } = options;
        this.port = port;
        this.publicPath = publicPath;
    }

    async start() {

        // * Middlewares

        // * Public Folder
        this.app.use(express.static(this.publicPath));

        // * Routes
        this.app.get('/api/todos', (req, res) => {
            res.json([
                { id: 1, text: 'Buy milk', createdAt: new Date() },
                { id: 2, text: 'Buy bread', createdAt: null },
                { id: 3, text: 'Buy butter', createdAt: new Date() }
            ]);
        })

        // * Para router de SPAs (Single Page Application)
        this.app.get('*', (req, res) => {
            // console.log(req.url);
            // res.send('Hello world!!');
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        });
        
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });

    }

}
