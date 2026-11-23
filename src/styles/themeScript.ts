import { colors } from "~/styles/tokens";

/**
 * Roda no <head>, antes da pintura, para a página já abrir no tema certo
 * (o SSR não sabe o tema do visitante).
 *
 * - Aceita só "light" ou "dark" do localStorage; senão segue o sistema.
 * - Alinha a <meta name="theme-color"> à escolha manual.
 * - Apaga a cor personalizada da identidade antiga (primaryColor).
 *
 * Conteúdo fixo, sem dado externo. Quando a CSP entrar (spec 0003),
 * o hash sha256 deste script precisa estar no script-src: qualquer mudança
 * aqui, ou nas cores colors.light.bg / colors.dark.bg de tokens.ts (que são
 * interpoladas no texto), exige recalcular o hash.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,s=localStorage.getItem("theme"),t=s==="light"||s==="dark"?s:null;if(t){d.setAttribute("data-theme",t);var c=t==="dark"?"${colors.dark.bg}":"${colors.light.bg}";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",c)})}localStorage.removeItem("primaryColor")}catch(e){}})();`;
