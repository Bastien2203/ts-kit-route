import http from "http";

export class HttpUtils {
  static body(req: http.IncomingMessage): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      req.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      req.on("error", (error) => {
        reject(error);
      });
    });
  }
}
