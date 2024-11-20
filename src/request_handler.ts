import { RouteManager } from "./route_manager";
import http from 'http';
import { HttpRequest } from "./http_messages";
import { HttpUtils } from "./http_utils";

export class RequestHandler {
    constructor(private routeManager: RouteManager) {
        console.dir(this.routeManager.routesMap, { depth: null });
    }

    async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        if (!req.method || !req.url) {
            res.writeHead(404);
            res.end("404 Not found");
            return;
        }

        const { route, params } = this.routeManager.getRoute(req.method, req.url);
        if (!route) {
            res.writeHead(404);
            res.end("404 Not found");
            return;
        }

        const body = await HttpUtils.body(req);
        const httpRequest: HttpRequest = {
            method: req.method,
            url: req.url,
            headers: Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key, value as string])),
            body,
            params: params || {},
        };

        const httpResponse = route.handler(httpRequest);
        res.writeHead(httpResponse.status, httpResponse.headers);
        res.end(httpResponse.body);
    }
}

