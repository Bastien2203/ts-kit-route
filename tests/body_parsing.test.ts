import { AbstractController, Get, HttpRequest, HttpResponse, Post, Server } from '../src';
import { HttpMessage } from '../src/http_messages';


class TestController extends AbstractController {
    // @ts-ignore
    @Post('/hello')
    testPostJson(req: HttpRequest): HttpResponse {
        if(!req.body) {
            return HttpMessage.BAD_REQUEST;
        }
        const { name } = req.body;
        return {
            status: 200,
            headers: {},
            body: `Hello ${name} !`
        }
    }

    // @ts-ignore
    @Post('/hello2')
    testPostText(req: HttpRequest): HttpResponse {
        if(!req.body) {
            return HttpMessage.BAD_REQUEST;
        }
        return {
            status: 200,
            headers: {},
            body: `Hello ${req.body} !`
        }
    }

    // @ts-ignore
    @Post('/hello3')
    testPostForm(req: HttpRequest): HttpResponse {
        if(!req.body) {
            return HttpMessage.BAD_REQUEST;
        }
        const { name } = req.body;
        return {
            status: 200,
            headers: {},
            body: `Hello ${name} !`
        }
    }

    // @ts-ignore
    @Get("/sendJSONBody")
    sendJSONBody(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: {
                message: "Hello World"
            }
        }
    }

    // @ts-ignore
    @Get("/sendAsynchronousJSONBody")
    sendAsynchronousJSONBody(req: HttpRequest): Promise<HttpResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: 200,
                    headers: {},
                    body: {
                        message: "Hello World"
                    }
                });
            }, 1000);
        });
    }

}


describe('Post Routes', () => {
    const server = new Server(3000);
    new TestController(server);

    beforeAll(() => {
        server.start();
    });

    afterAll(() => {
        server.stop();
    });

    test('json', async () => {
        const res = await fetch('http://localhost:3000/hello', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'John' })
        });
        const text = await res.text();
        expect(text).toBe('Hello John !');
    });

    test('text', async () => {
        const res = await fetch('http://localhost:3000/hello2', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: 'John'
        });
        const text = await res.text();
        expect(text).toBe('Hello John !');
    });

    test('form', async () => {
        const res = await fetch('http://localhost:3000/hello3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'name=John'
        });
        const text = await res.text();
        expect(text).toBe('Hello John !');
    });

    test('sendJSONBody', async () => {
        const res = await fetch('http://localhost:3000/sendJSONBody', {
            method: 'GET'
        });
        const json = await res.json();
        expect(json).toEqual({ message: "Hello World" });
    });

    test('sendAsynchronousJSONBody', async () => {
        const res = await fetch('http://localhost:3000/sendAsynchronousJSONBody', {
            method: 'GET'
        });
        const json = await res.json();
        expect(json).toEqual({ message: "Hello World" });
    });
});