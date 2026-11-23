import Header from "~/components/Shell/Header/Header";
import { useCompany } from "./useCompany";
import CompanyHero from "./components/CompanyHero/CompanyHero";
import ProductsSection from "./components/ProductsSection/ProductsSection";
import ServicesSection from "./components/ServicesSection/ServicesSection";
import FounderSection from "./components/FounderSection/FounderSection";
import CompanyContact from "./components/CompanyContact/CompanyContact";

export default function Company() {
  const { t, navItems, products, company, portfolioPath } = useCompany();

  return (
    <>
      <Header navItems={navItems} logoHref="#hero" />
      <main>
        <CompanyHero texts={t.hero} />
        <ProductsSection texts={t.products} products={products} />
        <ServicesSection texts={t.services} email={company.email} />
        <FounderSection
          texts={t.founder}
          founderName={company.founder.name}
          portfolioPath={portfolioPath}
        />
        <CompanyContact
          texts={t.contact}
          cnpjLabel={t.footer.cnpjLabel}
          companyName={company.name}
          email={company.email}
          cnpj={company.cnpj}
        />
      </main>
    </>
  );
}
