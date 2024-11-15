function createRouteDecorator(method: string) {
    return function(url: string) {
        return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            if (!target.constructor.prototype._prototypeRoutes) {
                target.constructor.prototype._prototypeRoutes = [];
            }
            target.constructor.prototype._prototypeRoutes.push({
                method,
                url,
                handler: descriptor.value
            });
        };
    };
}

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Delete = createRouteDecorator('DELETE');
export const Patch = createRouteDecorator('PATCH');