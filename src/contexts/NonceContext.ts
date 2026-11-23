import { createContext } from "react";

/**
 * Nonce da CSP desta requisição (spec 0003). Só o servidor tem provider
 * (entry.server); no cliente fica "", porque o navegador esconde o atributo
 * `nonce` e o script já rodou.
 */
export const NonceContext = createContext("");
