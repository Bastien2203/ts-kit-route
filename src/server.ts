import {  HttpRequest } from './http_messages';
import { HttpUtils } from './http_utils';
import {  RouteHandler } from './route';
import http from 'http';
import { RouteManager } from './route_manager';
import { RequestHandler } from './request_handler';



export class Server {
    server: http.Server;
    requestHandler: RequestHandler;

    constructor(private port: number, public routeManager: RouteManager) {
        this.server = http.createServer();
        this.requestHandler = new RequestHandler(routeManager);
    }

    async start() {
        try {
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