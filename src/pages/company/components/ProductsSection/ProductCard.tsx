import Cursor from "~/components/Brand/Cursor/Cursor";
import Chip from "~/components/UI/Chip/Chip";
import { ChipList } from "~/components/UI/Chip/styles";
import type { IProductCard } from "~/interfaces/company/IProduct";
import {
  Card,
  CardHeader,
  ProductName,
  StatusPill,
  Description,
  Platforms,
  ProductLink,
} from "./styles";

interface ProductCardProps {
  product: IProductCard;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <ProductName>{product.name}</ProductName>
        <StatusPill>
          <Cursor width="8px" height="3px" />
          {product.statusLabel}
        </StatusPill>
      </CardHeader>

      <Description>{product.description}</Description>

      {product.tags.length > 0 && (
        <ChipList>
          {product.tags.map((tag) => (
            <Chip key={tag} filled>
              {tag}
            </Chip>
          ))}
        </ChipList>
      )}

      <Platforms>
        {product.platforms.map((platform) => (
          <li key={platform}>{platform}</li>
        ))}
      </Platforms>

      {product.url && (
        <ProductLink href={product.url} target="_blank" rel="noopener noreferrer">
          {product.url.replace(/^https?:\/\//, "")} ↗
        </ProductLink>
      )}
    </Card>
  );
}
