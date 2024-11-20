import { Server } from "./server";
import { Route } from "./route";


export abstract class AbstractController {
    routes: Route[] = [];
    constructor(private server: Server) {
        const prototypeRoutes = Object.getPrototypeOf(this)._prototypeRoutes || [];
        this.routes = [...prototypeRoutes];
        this.server.routeManager.addRoutes(this.routes);
    }
}