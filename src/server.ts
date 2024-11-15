import Fastify from 'fastify';
import { Route } from './route';



export class Server {
    fastify: any;
    port: number;

    constructor(port: number) {
        this.fastify = Fastify();
        this.port = port;
    }

    addRoute(route: Route) {
        this.fastify.route({
            method: route.method,
            url: route.url,
            handler: route.handler
        });
    }

    addRoutes(routes: Route[]) {
        for (const route of routes) {
            this.addRoute(route);
        }
    }

    async start() {
        try {
            await this.fastify.listen({
                port: this.port,
            });
            console.log(`Server listening at http://localhost:${this.port}`);
            console.log(this.fastify.printRoutes());
        } catch (err) {
            this.fastify.log.error(err);
            process.exit(1);
        }
    }
}