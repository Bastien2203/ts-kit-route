import { AbstractController, Get, Server } from '../src';

class TestController extends AbstractController {

    // @ts-ignore
    @Get('/hello')
    test(req: any, res: any) {
        res.end("Hello World");
    }

    // @ts-ignore
    @Get('/hello/:name')
    test1Params(req: any, res: any, name: string) {
        res.end(`Hello ${name}`);
    }



    // @ts-ignore
    @Get('/hello/:name/:age')
    test2Params(res: any, req: any, age: number, name: string) {
        res.end(`Hello ${name} ${age}`);
    }
}

test('simple route', async () => {
    const server = new Server(3000);
    new TestController(server);
    server.start();

    const res = await fetch('http://localhost:3000/hello');
    const text = await res.text();
    expect(text).toBe('Hello World');
    server.stop();
});

test('route with 1 params', async () => {
    const server = new Server(3000);
    new TestController(server);
    server.start();

    const res = await fetch('http://localhost:3000/hello/John');
    const text = await res.text();
    expect(text).toBe('Hello John');
    server.stop();
});

test('route with 2 params', async () => {
    const server = new Server(3000);
    new TestController(server);
    server.start();

    const res = await fetch('http://localhost:3000/hello/John/30');
    const text = await res.text();
    expect(text).toBe('Hello John 30');
    server.stop();
});