import { DynamicNode, Route, RouteMap } from "./route";

export class RouteManager {
    routesMap: RouteMap = new Map();

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
    }

    addRoutes(routes: Route[]) {
        for (const route of routes) {
            this.addRoute(route);
        }
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

    getRoute(method: string, url: string): { route: Route | null; params: { [key: string]: string; }; } {
        const methodRoutes = this.routesMap.get(method);

        if (!methodRoutes) {
            return { route: null, params: {} };
        }

        // Static routes 

        const matchingStaticRoute = methodRoutes.static[url];
        if (matchingStaticRoute) {
            return { route: matchingStaticRoute, params: {} };
        }


        // Dynamic routes 

        const urlSegments = url.split('/').filter(segment => segment.length > 0);
        const params: { [key: string]: string } = {};
        const dynamicRoute = this.findDynamicRoute(methodRoutes.dynamic, urlSegments, params);

        if (dynamicRoute) {
            return { route: dynamicRoute, params };
        }

        return { route: null, params: {} };
    }

}