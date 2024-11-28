import { RouteManager } from "./route_manager";
import * as http from 'http'
import { HttpRequest } from "./http_messages";
import { HttpBodyParser } from "./http_body_parser";

export class RequestHandler {
    constructor(private routeManager: RouteManager) {
        
    }

    async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        if (!req.method || !req.url) {
            res.writeHead(404);
            res.end("404 Not found");
            return;
        }
        const url = req.url.split("?");

        const { route, params } = this.routeManager.getRoute(req.method, url[0]);
        if (!route) {
            res.writeHead(404);
            res.end("404 Not found");
            return;
        }


        const contentType = req.headers["content-type"];
        let body;

        try {
            if (contentType?.includes("application/json")) {
                body = await HttpBodyParser.parseJson(req);
            } else if (contentType?.includes("text/plain")) {
                body = await HttpBodyParser.parseText(req);
            } else if (contentType?.includes("application/x-www-form-urlencoded")) {
                body = await HttpBodyParser.parseFormUrlEncoded(req);
            } else {
                body = await HttpBodyParser.parse(req);
            }
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid request body" }));
            return;
        }

        const queryParams = url[1]?.split("&").reduce((acc, pair) => {
            const [key, value] = pair.split("=");
            acc[key] = value;
            return acc;
        }, {} as { [key: string]: string });

        const httpRequest: HttpRequest = {
            method: req.method,
            url: req.url,
            headers: Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key, value as string])),
            body,
            params: params || {},
            queryParams: queryParams || {},
        };

        const httpResponse = route.handler(httpRequest);
        if (typeof httpResponse.body === "object") {
            res.writeHead(httpResponse.status, {...httpResponse.headers, "Content-Type": "application/json"});
            res.end(JSON.stringify(httpResponse.body));
        } else {
            res.writeHead(httpResponse.status, httpResponse.headers);
            res.end(httpResponse.body);
        }
    }
}

