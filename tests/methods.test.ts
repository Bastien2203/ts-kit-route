import { AbstractController, HttpRequest, HttpResponse, Post, Server, Get, Put, Delete, Patch } from '../src';


class TestController extends AbstractController {
    // @ts-ignore
    @Get('/hello')
    testGet(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: req.method
        }
    }

    // @ts-ignore
    @Post('/hello')
    testPost(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: req.method
        }
    }

    // @ts-ignore
    @Put('/hello')
    testPut(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: req.method
        }
    }

    // @ts-ignore
    @Delete('/hello')
    testDelete(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: req.method
        }
    }

    // @ts-ignore
    @Patch('/hello')
    testPatch(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: req.method
        }
    }
}


describe('Methods', () => {
    const server = new Server(3002);
    new TestController(server);

    beforeAll(() => {
        server.start();
    });

    afterAll(() => {
        server.stop();
    });

    test('GET', async () => {
        const res = await fetch('http://localhost:3002/hello', {
            method: 'GET'
        });
        expect(await res.text()).toBe('GET');
    });

    test('POST', async () => {
        const res = await fetch('http://localhost:3002/hello', {
            method: 'POST'
        });
        expect(await res.text()).toBe('POST');
    });

    test('PUT', async () => {
        const res = await fetch('http://localhost:3002/hello', {
            method: 'PUT'
        });
        expect(await res.text()).toBe('PUT');
    });

    test('DELETE', async () => {
        const res = await fetch('http://localhost:3002/hello', {
            method: 'DELETE'
        });
        expect(await res.text()).toBe('DELETE');
    });

    test('PATCH', async () => {
        const res = await fetch('http://localhost:3002/hello', {
            method: 'PATCH'
        });
        expect(await res.text()).toBe('PATCH');
    });
});