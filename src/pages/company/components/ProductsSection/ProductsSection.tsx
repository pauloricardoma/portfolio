import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import Text from "~/components/UI/Text/Text";
import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import type { IProductCard } from "~/interfaces/company/IProduct";
import ProductCard from "./ProductCard";
import { SectionIntro, ProductsGrid } from "./styles";

interface ProductsSectionProps {
  texts: IDictionary["company"]["products"];
  products: IProductCard[];
}

export default function ProductsSection({ texts, products }: ProductsSectionProps) {
  const ref = useReveal();

  return (
    <Section id="products">
      <div ref={ref}>
        <Container>
          <Text variant="h1" align="center" className="reveal">
            {texts.title}
          </Text>
          <SectionIntro className="reveal">{texts.intro}</SectionIntro>

          <ProductsGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} className="reveal" />
            ))}
          </ProductsGrid>
        </Container>
      </div>
    </Section>
  );
}
