import type { Product } from "../../store/product/types.ts";
import { ProductCard } from "./ProductCard";

interface ProductsListProps {
    products: Product[];
    favorites: number[];
    discounts: { id: number; percentage: number }[];
    onToggleFavorite: (productId: number) => void;
    onProductClick?: (productId: number) => void;
    onAddToBag?: (productId: number) => void;
    showAddToBag?: boolean;
}

export function ProductsList({products, favorites, discounts, onToggleFavorite, onProductClick, onAddToBag, showAddToBag = false}: ProductsListProps) {
    return (
        <div className="row g-1 mx-0">
            {products.map(product => (
                <div
                    key={product.id}
                    className="col-6 col-md-4 col-lg-3 pb-4"
                >
                    <ProductCard
                        product={product}
                        favorite={favorites.includes(product.id)}
                        discounts={discounts}
                        onToggleFavorite={onToggleFavorite}
                        onClick={() => onProductClick?.(product.id)}
                        onAddToBag={() => onAddToBag?.(product.id)}
                        showAddToBag={showAddToBag}
                    />
                </div>
            ))}
        </div>
    );
}