import { Route } from './route';
import http from 'http';



export class Server {
    server: http.Server;
    port: number;

    constructor(port: number) {
        this.server = http.createServer();
        this.port = port;
    }



    addRoute(route: Route) {
        this.server.on('request', (req, res) => {
            if (req.method === route.method && req.url === route.url) {
                route.handler(req, res);
            }
        });
    }

    addRoutes(routes: Route[]) {
        for (const route of routes) {
            this.addRoute(route);
        }
    }

    async start() {
        try {
            this.server.listen({
                port: this.port,
            });
            console.log(`Server listening at http://localhost:${this.port}`);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    async stop() {
        this.server.close();
    }
}