import { useState, useCallback, type MouseEvent } from "react";
import { Link } from "react-router";
import LogoMark from "~/components/Brand/LogoMark/LogoMark";
import LanguageToggle from "~/components/Shell/LanguageToggle/LanguageToggle";
import { useAppTheme } from "~/contexts/ThemeContext";
import { useLocale } from "~/hooks/useLocale";
import type { INavItem } from "~/interfaces/shell/INavItem";
import {
  HeaderWrapper,
  HeaderInner,
  Logo,
  Wordmark,
  NavLinks,
  NavLink,
  HeaderActions,
  ThemeToggle,
  MenuButton,
  MobileMenu,
  MobileNavLink,
} from "./styles";

interface HeaderProps {
  navItems: INavItem[];
  /** "#id" rola até a âncora; um caminho ("/") navega para a rota */
  logoHref: string;
}

export default function Header({ navItems, logoHref }: HeaderProps) {
  const { toggleTheme } = useAppTheme();
  const { t, to } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchor = useCallback((e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

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

  const logoContent = (
    <>
      <LogoMark size={30} />
      <Wordmark>
        PRMA <span>Code</span>
      </Wordmark>
    </>
  );

  return (
    <HeaderWrapper>
      <HeaderInner>
        {logoHref.startsWith("#") ? (
          <Logo href={logoHref} onClick={(e) => handleAnchor(e, logoHref)}>
            {logoContent}
          </Logo>
        ) : (
          <Logo as={Link} to={to(logoHref)}>
            {logoContent}
          </Logo>
        )}

        <NavLinks>{navItems.map((item) => renderItem(item, false))}</NavLinks>

        <HeaderActions>
          <LanguageToggle />

          {/* Rótulo por CSS ([data-theme]): o SSR não sabe o tema do visitante */}
          <ThemeToggle onClick={toggleTheme} aria-label={t.header.toggleTheme}>
            <span className="only-light">{t.header.themeDark}</span>
            <span className="only-dark">{t.header.themeLight}</span>
          </ThemeToggle>

          <MenuButton
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={t.header.menu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </MenuButton>
        </HeaderActions>
      </HeaderInner>

      <MobileMenu id="mobile-menu" $open={mobileMenuOpen}>
        {navItems.map((item) => renderItem(item, true))}
      </MobileMenu>
    </HeaderWrapper>
  );
}
