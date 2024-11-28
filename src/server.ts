import * as http from 'http'
import { RouteManager } from './route_manager';
import { RequestHandler } from './request_handler';



export class Server {
    server: http.Server;
    requestHandler: RequestHandler;
    public routeManager: RouteManager;

    constructor(private port: number) {
        this.server = http.createServer();
        this.routeManager = new RouteManager();
        this.requestHandler = new RequestHandler(this.routeManager);
    }

    async start() {
        try {
            console.dir(this.routeManager.routesMap, { depth: null });
            this.server.addListener('request', (req, res) => this.requestHandler.handleRequest(req, res));

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