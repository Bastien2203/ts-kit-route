import { AbstractController, HttpRequest, HttpResponse, Post, Server } from '../src';
import { HttpMessage } from '../src/http_messages';


class TestController2 extends AbstractController {
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

}


describe('Post Routes', () => {
    const server = new Server(3000);
    new TestController2(server);

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
});