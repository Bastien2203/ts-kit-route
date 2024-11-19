import { DynamicNode, Route, RouteMap } from './route';
import http from 'http';



export class Server {
    server: http.Server;
    port: number;
    routesMap: RouteMap = new Map();

    constructor(port: number) {
        this.server = http.createServer();
        this.port = port;
    }



    private findDynamicRoute(
        node: DynamicNode,
        segments: string[],
        params: { [key: string]: string } = {}
    ): Route | null {
        if (segments.length === 0) {
            return node['__route'] as Route || null;
        }
    
        const [current, ...rest] = segments;
    
        // Correspondance exacte
        if (node[current]) {
            const route = this.findDynamicRoute(node[current] as DynamicNode, rest, params);
            if (route) return route;
        }
    
        // Correspondance dynamique
        if (node['*']) {
            const dynamicNode = node['*'] as DynamicNode;
            if (dynamicNode.paramName) {
                params[(dynamicNode["paramName"] as string)] = current;
            }
            const route = this.findDynamicRoute(dynamicNode, rest, params);
            if (route) return route;
        }
    
        return null;
    }
    
    
    


    addRoute(route: Route) {
        if (!this.routesMap.has(route.method)) {
            this.routesMap.set(route.method, { dynamic: {}, static: {} });
        }
    
        const routeSegments = route.url.split('/').filter(segment => segment.length > 0);
        let isDynamic = false;
    
        const methodRoutes = this.routesMap.get(route.method)!;
    
        // Dynamic route
        if (routeSegments.some(segment => segment.startsWith(':'))) {
            isDynamic = true;
            let currentNode: DynamicNode = methodRoutes.dynamic;
    
            for (let i = 0; i < routeSegments.length; i++) {
                const segment = routeSegments[i];
                if (segment.startsWith(':')) {
                    const paramName = segment.substring(1); 
                    if (!currentNode['*']) {
                        currentNode['*'] = { paramName: paramName }; 
                    }
                    currentNode = currentNode['*'] as DynamicNode;
                } else {
                    if (!currentNode[segment]) {
                        currentNode[segment] = {};
                    }
                    currentNode = currentNode[segment] as DynamicNode;
                }
            }
    
            currentNode['__route'] = route;
        } else {
            // Static route
            const routeKey = routeSegments.join('/');
            methodRoutes.static[`/${routeKey}`] = route;
        }
    
        console.log(`Added route: ${route.url} (${isDynamic ? 'dynamic' : 'static'})`);
    }
    

    addRoutes(routes: Route[]) {
        for (const route of routes) {
            this.addRoute(route);
        }
    }

    requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
        if (!req.method) {
            res.writeHead(404);
            res.end("404 Not found");
            return;
        }

        const methodRoutes = this.routesMap.get(req.method);
        if (!methodRoutes || !req.url) {
            res.writeHead(404);
            res.end("404 Not found");
            return;
        }

        // static route

        const url = req.url.split('?')[0];

        const matchingStaticRoutes = methodRoutes.static[url];
        if (matchingStaticRoutes) {
            const args = matchingStaticRoutes.paramNames.map(param =>
                param === 'req' ? req : param === 'res' ? res : undefined
            );
            matchingStaticRoutes.handler(...args);
            return;
        }


        // dynamic route
    
        const urlSegments = req.url.split('/').filter(segment => segment.length > 0);
        const params : { [key: string]: string } = {};
        const dynamicRoute = this.findDynamicRoute(methodRoutes.dynamic, urlSegments, params);

        if (dynamicRoute) {
            const args = dynamicRoute.paramNames.map(param =>
                param === 'req' ? req : param === 'res' ? res : params[param]
            );
            dynamicRoute.handler(...args);
            return;
        }

        res.writeHead(404);
        res.end("404 Not found");
    }



    async start() {
        try {
            this.server.addListener('request', (req, res) => { this.requestListener(req, res) });
        
            console.dir(this.routesMap, { depth: null });

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