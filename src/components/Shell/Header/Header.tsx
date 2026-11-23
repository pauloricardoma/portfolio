import { useState, useCallback, type MouseEvent } from "react";
import { Link } from "react-router";
import Container from "~/components/UI/Container/Container";
import ColorPicker from "~/components/UI/ColorPicker/ColorPicker";
import LanguageToggle from "~/components/Shell/LanguageToggle/LanguageToggle";
import { useAppTheme } from "~/contexts/ThemeContext";
import { useLocale } from "~/hooks/useLocale";
import type { INavItem } from "~/interfaces/shell/INavItem";
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

interface HeaderProps {
  navItems: INavItem[];
  /** "#id" rola até a âncora; um caminho ("/") navega para a rota */
  logoHref: string;
}

export default function Header({ navItems, logoHref }: HeaderProps) {
  const { themeMode, toggleTheme } = useAppTheme();
  const { t, to } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchor = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      document
        .getElementById(href.replace("#", ""))
        ?.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    },
    []
  );

  const renderItem = (item: INavItem, mobile: boolean) => {
    const Component = mobile ? MobileNavLink : NavLink;

    if (item.kind === "route") {
      return (
        <Component key={item.href} as={Link} to={to(item.href)}>
          {item.label}
        </Component>
      );
    }

    return (
      <Component
        key={item.href}
        href={item.href}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => handleAnchor(e, item.href)}
      >
        {item.label}
      </Component>
    );
  };

  const isAnchorLogo = logoHref.startsWith("#");

  return (
    <>
      <HeaderWrapper>
        <Container>
          <HeaderInner>
            {isAnchorLogo ? (
              <Logo href={logoHref} onClick={(e) => handleAnchor(e, logoHref)}>
                PRMA Code
              </Logo>
            ) : (
              <Logo as={Link} to={to(logoHref)}>
                PRMA Code
              </Logo>
            )}

            <NavLinks>{navItems.map((item) => renderItem(item, false))}</NavLinks>

            <HeaderActions>
              <LanguageToggle />

              <ColorPicker />

              <ThemeToggle
                onClick={toggleTheme}
                aria-label={t.header.switchTheme(themeMode === "light")}
              >
                {themeMode === "light" ? "🌙" : "☀️"}
              </ThemeToggle>

              <HamburgerButton
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={t.header.menu}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </HamburgerButton>
            </HeaderActions>
          </HeaderInner>
        </Container>
      </HeaderWrapper>

      <MobileMenu $open={mobileMenuOpen}>
        {navItems.map((item) => renderItem(item, true))}
      </MobileMenu>
    </>
  );
}
