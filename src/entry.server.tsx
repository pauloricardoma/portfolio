import type { HandleDocumentRequestFunction } from "react-router";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { ServerStyleSheet } from "styled-components";
import { createNonce, securityHeaders } from "~/config/security";
import { NonceContext } from "~/contexts/NonceContext";

const handleRequest: HandleDocumentRequestFunction = (
  request,
  responseStatusCode,
  responseHeaders,
  routerContext,
) => {
  /**
   * CSP com nonce por requisição (spec 0003, ADR 0005). Os headers entram
   * ANTES do render, para valerem também em erro e timeout.
   */
  const nonce = createNonce();
  const headers = securityHeaders(nonce, process.env.NODE_ENV === "production");
  for (const [name, value] of Object.entries(headers)) responseHeaders.set(name, value);

  const sheet = new ServerStyleSheet();

  return new Promise<Response>((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      sheet.collectStyles(
        // O nonce vai a três lugares: scripts de dados do ServerRouter,
        // scripts do React (opção nonce abaixo) e os do root.tsx (contexto)
        <NonceContext.Provider value={nonce}>
          <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
        </NonceContext.Provider>
      ),
      {
        nonce,
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
          // Só o erro; o nonce nunca vai para log
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
