import { AbstractController, Get, HttpRequest, HttpResponse, Server } from '../src';


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
    @Get("/hello/queryParams")
    testQueryParams(req: HttpRequest): HttpResponse {
        const { name, age } = req.queryParams;
        return {
            status: 200,
            headers: {},
            body: `Hello ${name} ${age} !`
        }
    }
}

describe('Get Routes', () => {
    const server = new Server(3001);
    new TestController(server);

    beforeAll(() => {
        server.start();
    });

    afterAll(() => {
        server.stop();
    });

    test('simple route', async () => {
        const res = await fetch('http://localhost:3001/hello');
        const text = await res.text();
        expect(text).toBe('Hello World !');
    });

    test('simple route 2', async () => {
        const res2 = await fetch('http://localhost:3001/hello/test');
        const text2 = await res2.text();
        expect(text2).toBe('Hello Test !');
    });


    test('route with 1 params', async () => {
        const res = await fetch('http://localhost:3001/hello/John');
        const text = await res.text();
        expect(text).toBe('Hello John !');
    });

    test('route with 2 params', async () => {
        const res = await fetch('http://localhost:3001/hello/John/30');
        const text = await res.text();
        expect(text).toBe('Hello John 30 !');
    });

    test('route with query params', async () => {
        const res = await fetch('http://localhost:3001/hello/queryParams?name=John&age=30');
        const text = await res.text();
        expect(text).toBe('Hello John 30 !');
    });
});
