import { Server } from "./server";
import { Route } from "./route";


export abstract class AbstractController {
    server: Server;
    routes: Route[] = [];

    constructor(server: Server) {
        this.server = server;

        const prototypeRoutes = Object.getPrototypeOf(this)._prototypeRoutes || [];
        this.routes = [...prototypeRoutes];
        this.server.addRoutes(this.routes);
    }
}