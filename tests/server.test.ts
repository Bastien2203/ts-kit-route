import { AbstractController, Get, HttpRequest, HttpResponse, Post, Server } from '../src';
import { HttpMessage } from '../src/http_messages';
import { RouteManager } from '../src/route_manager';


class TestController extends AbstractController {

    // @ts-ignore
    @Get('/hello')
    test(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: 'Hello World !'
        }
    }

    // @ts-ignore
    @Get('/hello/test')
    tes2(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: 'Hello Test !'
        }
    }

    // @ts-ignore
    @Get('/hello/:name')
    test1Params(req: HttpRequest): HttpResponse {
        const { name } = req.params;
        return {
            status: 200,
            headers: {},
            body: `Hello ${name} !`
        }
    }

    // @ts-ignore
    @Get('/hello/:name/:age')
    test2Params(req: HttpRequest): HttpResponse {
        const { name, age } = req.params;
        return {
            status: 200,
            headers: {},
            body: `Hello ${name} ${age} !`
        }
    }

    // @ts-ignore
    @Post('/hello')
    testPost(req: HttpRequest): HttpResponse {
        if(!req.body) {
            return HttpMessage.BAD_REQUEST;
        }

        const { name } = JSON.parse(req.body.toString());
        return {
            status: 200,
            headers: {},
            body: `Hello ${name} !`
        }
    }

}

describe('Get Routes', () => {
    test('simple route', async () => {
        const routeManager = new RouteManager();
        const server = new Server(3000, routeManager);
        new TestController(server);
        server.start();

        const res = await fetch('http://localhost:3000/hello');
        const text = await res.text();
        expect(text).toBe('Hello World !');

        server.stop();
    });

    test('simple route 2', async () => {
        const routeManager = new RouteManager();
        const server = new Server(3000, routeManager);
        new TestController(server);
        server.start();

        const res2 = await fetch('http://localhost:3000/hello/test');
        const text2 = await res2.text();
        expect(text2).toBe('Hello Test !');

        server.stop();
    });


    test('route with 1 params', async () => {
        const routeManager = new RouteManager();
        const server = new Server(3000, routeManager);
        new TestController(server);
        server.start();

        const res = await fetch('http://localhost:3000/hello/John');
        const text = await res.text();
        expect(text).toBe('Hello John !');
        server.stop();
    });

    test('route with 2 params', async () => {
        const routeManager = new RouteManager();
        const server = new Server(3000,routeManager);
        new TestController(server);
        server.start();

        const res = await fetch('http://localhost:3000/hello/John/30');
        const text = await res.text();
        expect(text).toBe('Hello John 30 !');
        server.stop();
    });
});

describe('Post Routes', () => {
    test('simple route', async () => {
        const routeManager = new RouteManager();
        const server = new Server(3000, routeManager);
        new TestController(server);
        server.start();

        const res = await fetch('http://localhost:3000/hello', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'John' })
        });
        const text = await res.text();
        expect(text).toBe('Hello John !');

        server.stop();
    });
});