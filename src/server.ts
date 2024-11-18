import { Route } from './route';
import http from 'http';



export class Server {
    server: http.Server;
    port: number;

    constructor(port: number) {
        this.server = http.createServer();
        this.port = port;
    }

    extractParamNames(func: Function): string[] {
        const functionString = func.toString();
        const paramMatch = functionString.match(/\(([^)]*)\)/);
        if (!paramMatch) return [];
        return paramMatch[1]
            .split(',')
            .map((param) => param.trim().replace(/\/\*.*\*\//, '').replace(/\?.*/, ''));
    }


    addRoute(route: Route) {
        this.server.on('request', (req, res) => {
            const urlParts = req.url?.split('/');
            const routeParts = route.url.split('/');

            if (req.method !== route.method) {
                return;
            }

            if (urlParts?.length !== routeParts.length) {
                return;
            }

            const params: { [key: string]: string } = {};
            for (let i = 0; i < urlParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    params[routeParts[i].substring(1)] = urlParts[i];
                } else if (routeParts[i] !== urlParts[i]) {
                    return;
                }
            }

            // Inject params into the handler 
            const handlerParams = this.extractParamNames(route.handler);
         

            const args = handlerParams.map((param) => {
                switch(param) {
                    case "req":
                        return req;
                    case "res":
                        return res;
                    default:
                        return params[param]
                }       
            });
  
            route.handler(...args);
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