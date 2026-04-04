/**
 * Header.tsx — Navegação fixa com glassmorphism.
 *
 * CONCEITOS:
 *
 * 1. SCROLL DETECTION:
 *    Usamos useEffect + window scroll listener pra detectar
 *    quando o usuário passou do Hero (100vh). Só então o header aparece.
 *    Isso evita o header cobrindo o Hero (que é fullscreen).
 *
 * 2. SMOOTH SCROLL via anchor links:
 *    Os links apontam pra "#hero", "#projects", etc.
 *    O scroll-behavior: smooth no CSS + scrollIntoView() fazem
 *    a página deslizar suavemente até a seção.
 *
 * 3. useAppTheme():
 *    Hook que criamos no ThemeContext — retorna themeMode e toggleTheme.
 *    O botão de tema alterna entre sol e lua.
 */
import { useState, useEffect, useCallback } from "react";
import Container from "~/components/UI/Container/Container";
import ColorPicker from "~/components/UI/ColorPicker/ColorPicker";
import { useAppTheme } from "~/contexts/ThemeContext";
import {
  HeaderWrapper,
  HeaderInner,
  Logo,
  NavLinks,
  NavLink,
  HeaderActions,
  ThemeToggle,
  HamburgerButton,
  MobileMenu,
  MobileNavLink,
} from "./styles";

const NAV_ITEMS = [
  { label: "Início", href: "#hero" },
  { label: "Projetos", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contato", href: "#contact" },
];

export default function Header() {
  const { themeMode, toggleTheme } = useAppTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Scroll listener: mostra o header só depois de scrollar
   * 50% da viewport (metade do Hero).
   * Cleanup: remove o listener quando o componente desmonta.
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback(
    (href: string) => {
      const id = href.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    },
    []
  );

  return (
    <>
      <HeaderWrapper $visible={isVisible}>
        <Container>
          <HeaderInner>
            <Logo href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}>
              PR
            </Logo>

            <NavLinks>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.href);
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
            </NavLinks>

            <HeaderActions>
              <ColorPicker />

              <ThemeToggle
                onClick={toggleTheme}
                aria-label={`Mudar para tema ${themeMode === "light" ? "escuro" : "claro"}`}
              >
                {themeMode === "light" ? "🌙" : "☀️"}
              </ThemeToggle>

              <HamburgerButton
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </HamburgerButton>
            </HeaderActions>
          </HeaderInner>
        </Container>
      </HeaderWrapper>

      <MobileMenu $open={mobileMenuOpen && isVisible}>
        {NAV_ITEMS.map((item) => (
          <MobileNavLink
            key={item.href}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(item.href);
            }}
          >
            {item.label}
          </MobileNavLink>
        ))}
      </MobileMenu>
    </>
  );
}
