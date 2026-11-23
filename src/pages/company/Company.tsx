import Header from "~/components/Shell/Header/Header";
import Footer from "~/components/Shell/Footer/Footer";
import { useCompany } from "./useCompany";
import CompanyHero from "./components/CompanyHero/CompanyHero";
import ProductsSection from "./components/ProductsSection/ProductsSection";
import ServicesSection from "./components/ServicesSection/ServicesSection";
import FounderSection from "./components/FounderSection/FounderSection";
import CompanyContact from "./components/CompanyContact/CompanyContact";

export default function Company() {
  const { t, navItems, products, company, portfolioPath, footer } = useCompany();

  return (
    <>
      <Header navItems={navItems} logoHref="#hero" />
      <main>
        <CompanyHero texts={t.hero} email={company.email} />
        <ProductsSection index="01" texts={t.products} products={products} />
        <ServicesSection index="02" texts={t.services} email={company.email} />
        <FounderSection
          index="03"
          texts={t.founder}
          founderName={company.founder.name}
          stack={company.founder.stack}
          portfolioPath={portfolioPath}
        />
        <CompanyContact index="04" texts={t.contact} email={company.email} />
      </main>
      <Footer left={footer.left} right={footer.right} />
    </>
  );
}
