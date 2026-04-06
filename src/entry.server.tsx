import type { HandleDocumentRequestFunction } from "react-router";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { ServerStyleSheet } from "styled-components";

const handleRequest: HandleDocumentRequestFunction = (
  request,
  responseStatusCode,
  responseHeaders,
  routerContext,
) => {
  const sheet = new ServerStyleSheet();

  return new Promise<Response>((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      sheet.collectStyles(
        <ServerRouter context={routerContext} url={request.url} />
      ),
      {
        onAllReady() {
          const body = new PassThrough();
          let html = "";

          body.on("data", (chunk: Buffer) => {
            html += chunk.toString();
          });

          body.on("end", () => {
            const styleTags = sheet.getStyleTags();
            sheet.seal();

            const fullHtml = `<!DOCTYPE html>${html.replace(
              "</head>",
              `${styleTags}</head>`
            )}`;

            responseHeaders.set("Content-Type", "text/html");

            resolve(
              new Response(fullHtml, {
                headers: responseHeaders,
                status: responseStatusCode,
              })
            );
          });

          body.on("error", (error) => {
            sheet.seal();
            reject(error);
          });

          pipe(body);
        },
        onShellError(error: unknown) {
          sheet.seal();
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          console.error(error);
        },
      }
    );

    setTimeout(() => {
      abort();
      sheet.seal();
    }, 5000);
  });
};

export default handleRequest;
