
export interface OrderItemInput {
    variantId: number;
    quantity: number;
}

export interface CreateOrderInput {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingOptionId: number;
    paymentMethod: string;
    items: OrderItemInput[];
    shippingCountry?: string;
    shippingCity?: string;
    shippingPostalCode?: string;
    shippingStreet?: string;
    shippingBuilding?: string;
    shippingApartment?: string;
    pickupPointId?: string;
    pickupPointName?: string;
    storeId?: string;
    storeName?: string;
}

export interface CreateOrderData {
    userId: number | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingOptionId: number;
    paymentMethod: string;
    shippingCountry?: string;
    shippingCity?: string;
    shippingPostalCode?: string;
    shippingStreet?: string;
    shippingBuilding?: string;
    shippingApartment?: string;
    pickupPointId?: string;
    pickupPointName?: string;
    storeId?: string;
    storeName?: string;
    subtotal: number;
    items: {
        variantId: number;
        quantity: number;
        productName: string;
        size: string;
        color: string;
        price: number;
    }[];
}
