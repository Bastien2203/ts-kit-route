import { HttpRequest, HttpResponse } from "./http_messages";

export interface Route {
    method: string;
    url: string;
    handler: RouteHandler;
    paramNames: string[];
}

export type RouteHandler = (req: HttpRequest) => Promise<HttpResponse> | HttpResponse;

export type DynamicNode = { [key: string]: Route | DynamicNode | string };

export type RouteMap = Map<string, {
    dynamic: DynamicNode,
    static: { [key: string]: Route }
}>;