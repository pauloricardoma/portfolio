import Text from "~/components/UI/Text/Text";
import type { IProductCard } from "~/interfaces/company/IProduct";
import {
  Card,
  CardHeader,
  StatusBadge,
  PlatformList,
  PlatformTag,
  ProductLink,
} from "./styles";

interface ProductCardProps {
  product: IProductCard;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <Text variant="h3">{product.name}</Text>
        <StatusBadge>{product.statusLabel}</StatusBadge>
      </CardHeader>

      <Text variant="body" style={{ marginTop: 12, opacity: 0.85 }}>
        {product.description}
      </Text>

      <PlatformList>
        {product.platforms.map((platform) => (
          <PlatformTag key={platform}>{platform}</PlatformTag>
        ))}
      </PlatformList>

      {product.url && (
        <ProductLink href={product.url} target="_blank" rel="noopener noreferrer">
          {product.url.replace(/^https?:\/\//, "")} →
        </ProductLink>
      )}
    </Card>
  );
}
