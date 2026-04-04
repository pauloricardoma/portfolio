/**
 * entry.server.tsx — Customização do SSR para styled-components.
 *
 * POR QUE ISSO EXISTE:
 *
 * Sem esse arquivo, o React Router renderiza o HTML no servidor
 * mas NÃO inclui os estilos do styled-components. Resultado:
 * 1. Browser recebe HTML sem CSS do styled-components
 * 2. Renderiza tudo "nu" (sem cores, sem layout, sem fontes)
 * 3. Client hidrata → styled-components injeta TODOS os estilos
 * 4. Layout inteiro muda → CLS absurdo (1.0+)
 *
 * COMO FUNCIONA:
 *
 * 1. sheet.collectStyles() wrappa o componente pra coletar CSS
 * 2. renderToPipeableStream() renderiza em stream (padrão React 19)
 * 3. Bufferizamos o stream completo em memória
 * 4. sheet.getStyleTags() retorna as <style> tags coletadas
 * 5. Injetamos no </head> do HTML
 * 6. Enviamos o HTML completo com estilos ao browser
 *
 * POR QUE BUFFERIZAR em vez de streaming direto:
 *
 * styled-components v6 tem interleaveWithNodeStream() pra streaming,
 * mas ele usa require() internamente — não funciona em ESM (Vite).
 * Bufferizar o stream e injetar depois é o workaround mais robusto.
 * Pra um portfólio (HTML pequeno), a diferença de latência é ~10ms.
 */
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
    /**
     * Pra crawlers (Googlebot): onAllReady — espera o HTML completo.
     * Pra usuários reais: onShellReady — mais rápido (TTFB menor).
     * Aqui usamos onAllReady pra AMBOS porque vamos bufferizar o
     * stream inteiro de qualquer forma (pra injetar styles no head).
     */
    const { pipe, abort } = renderToPipeableStream(
      sheet.collectStyles(
        <ServerRouter context={routerContext} url={request.url} />
      ),
      {
        onAllReady() {
          /**
           * PassThrough é um stream Node que é readable E writable.
           * pipe(body) escreve o HTML do React no body.
           * Ouvimos os chunks com 'data' e acumulamos em string.
           */
          const body = new PassThrough();
          let html = "";

          body.on("data", (chunk: Buffer) => {
            html += chunk.toString();
          });

          body.on("end", () => {
            /**
             * Agora temos o HTML completo em memória.
             * getStyleTags() retorna as <style data-styled> tags.
             * Injetamos antes do </head> pra que o browser
             * já tenha os estilos quando pintar o body.
             */
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
