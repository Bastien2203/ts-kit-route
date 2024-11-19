export interface Route {
    method: string;
    url: string;
    handler: Function;
    paramNames: string[];
}


export type DynamicNode = { [key: string]: Route | DynamicNode | string };

export type RouteMap = Map<string, {
    dynamic: DynamicNode,
    static: { [key: string]: Route }
}>;