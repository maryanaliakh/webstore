import type { Product } from "../../store/product/types.ts";

interface ProductCardProps {
    product: Product;
    favorite: boolean;
    onToggleFavorite: (productId: number) => void;
    onClick?: () => void;
    children?: React.ReactNode;
    discounts: {
        id: number;
        percentage: number;
    }[];
    onAddToBag?: () => void;
    showAddToBag?: boolean;
    price?: number;
    showColors?: boolean;
}

export function ProductCard({product, favorite, showAddToBag, onAddToBag, onToggleFavorite, discounts, onClick, children, price: customPrice, showColors = true}: ProductCardProps) {
    const discount = discounts.find(d => d.id === product.discount_id);
    const price = Number(customPrice ?? product.price);

    const finalPrice = discount
        ? price * (1 - Number(discount.percentage) / 100)
        : price;

    return (
        <div className="position-relative" onClick={onClick}>
            <div className="position-relative">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-100"
                    style={{ aspectRatio: "3 / 4", objectFit: "cover" }}
                />

                <button
                    type="button"
                    className="btn p-0 position-absolute bottom-0 end-0 m-3"
                    onClick={event => {
                        event.stopPropagation();
                        onToggleFavorite(product.id);
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                            d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
                            fill={favorite ? "#FF6B35" : "white"}
                            stroke={favorite ? "#FF6B35" : "black"}
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div className="px-2 py-2">
                <div className="mb-1 fw-semibold small">
                    {product.name.toUpperCase()}
                </div>

                <div className="d-flex align-items-center gap-2">
                <span className={`fw-semibold small ${discount ? "bg-danger text-white px-1" : ""}`}>
                    {finalPrice.toFixed(2)} zł

                    {discount && (
                        <span className="text-white ms-2">
                            -{Number(discount.percentage)}%
                        </span>
                    )}
                </span>

                    {discount && (
                        <span className="fw-semibold text-secondary text-decoration-line-through small">
                            {price.toFixed(2)} zł
                        </span>
                    )}
                </div>

                {showColors && (
                    <div className="d-flex gap-2 mb-3 mt-1" style={{ minHeight: "21px" }}>
                        {product.colors.length > 1 && (
                            <small>{product.colors.length} COLORS</small>
                        )}
                    </div>
                )}
            </div>

            {showAddToBag && (
                <button
                    type="button"
                    className="btn btn-light d-block mx-auto py-3 mt-2 rounded-0 btn-sm px-3 w-100"
                    onClick={event => {
                        event.stopPropagation();
                        onAddToBag?.();
                    }}
                >
                    ADD TO BAG
                </button>
            )}

            {children}
        </div>
    );
}