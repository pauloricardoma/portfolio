import SplitSection from "~/components/UI/SplitSection/SplitSection";
import type { IDictionary } from "~/i18n/types";
import type { IProductCard } from "~/interfaces/company/IProduct";
import ProductCard from "./ProductCard";
import { ProductsList } from "./styles";

interface ProductsSectionProps {
  index: string;
  texts: IDictionary["company"]["products"];
  products: IProductCard[];
}

export default function ProductsSection({ index, texts, products }: ProductsSectionProps) {
  return (
    <SplitSection id="products" index={index} label={texts.label} title={texts.title}>
      <ProductsList>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductsList>
    </SplitSection>
  );
}
