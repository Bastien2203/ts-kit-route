# ts-route-kit

[**ts-route-kit**](https://www.npmjs.com/package/ts-route-kit) is a lightweight framework based on http package for creating HTTP routes using decorators. It simplifies the definition of routes with TypeScript.


## Installation

```bash
npm install ts-route-kit
```

## Features

- Simplifies HTTP route creation using decorators.
- Fully written in TypeScript for robust types and modern features.

## Configuration

Add a `tsconfig.json` file to your project for TypeScript compilation:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
    "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

## Usage

### Create a Controller

```typescript
import { AbstractController, Get, Server, HttpRequest, HttpResponse, HttpResponse, HttpMessage } from "ts-route-kit";

export class HelloController extends AbstractController {
    @Get('/hello')
    helloHandler(req: HttpRequest): HttpResponse {
        return {
            status: 200,
            headers: {},
            body: req.method
        }
    }

    @Get('/hello/:name')
    helloHandlerWithParams(req: HttpRequest): HttpResponse {
      const { name } = req.params
      return {
            status: 200,
            headers: {},
            body: { message: `Hello ${name}` }
        }
    }

    @Post('/hello')
    helloPostHandler(req: HttpRequest): HttpResponse {
      const { name } = req.body
      if(!name) {
          return HttpMessage.BAD_REQUEST;
      }
      return {
          status: 200,
          headers: {},
          body: { message: `Hello ${name}` }
      }
    }
}
```

### Set Up the Server

```typescript
import { HelloController, Server } from "./HelloController";

const server = new Server(8080);

// Instantiate your controller
new HelloController(server);


// Start the server
server.start()
```

## API

### Decorators

- `@Get(path: string)`   : Defines an HTTP GET route.
- `@Post(path: string)`  : Defines an HTTP POST route.
- `@Put(path: string)`   : Defines an HTTP PUT route.
- `@Delete(path: string)`: Defines an HTTP DELETE route.
- `@Patch(path: string)` : Defines an HTTP PATCH route.


## Contributions

Contributions are welcome! Open an issue or a pull request on [GitHub](https://github.com/Bastien2203/ts-kit-route).

## License

MIT
