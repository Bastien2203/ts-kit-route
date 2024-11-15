import { AbstractController, Get, Server } from '../src';

class TestController extends AbstractController {

    // @ts-ignore
    @Get('/hello')
    test(req: any, res: any) {
        res.end("Hello World");
    }
}

test('server', async () => {
    const server = new Server(3000);
    new TestController(server);
    server.start();

    const res = await fetch('http://localhost:3000/hello');
    const text = await res.text();
    expect(text).toBe('Hello World');
    server.stop();
});