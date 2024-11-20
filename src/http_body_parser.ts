import http from "http";


export class HttpBodyParser {
    static async parse(req: http.IncomingMessage): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];

            req.on("data", (chunk) => {
                chunks.push(chunk);
            });

            req.on("end", () => {
                resolve(Buffer.concat(chunks));
            });

            req.on("error", (error) => {
                reject(new Error(`Error reading request body: ${error.message}`));
            });
        });
    }

    static async parseJson(req: http.IncomingMessage): Promise<any> {
        const body = await this.parse(req);
        try {
            return JSON.parse(body.toString());
        } catch (error) {
            throw new Error("Failed to parse JSON body.");
        }
    }

    static async parseText(req: http.IncomingMessage): Promise<string> {
        const body = await this.parse(req);
        return body.toString();
    }

    static async parseFormUrlEncoded(req: http.IncomingMessage): Promise<Record<string, string>> {
        const body = await HttpBodyParser.parseText(req);
        return body.split("&").reduce((acc, pair) => {
            const [key, value] = pair.split("=");
            acc[decodeURIComponent(key)] = decodeURIComponent(value || "");
            return acc;
        }, {} as Record<string, string>);
    }
}
