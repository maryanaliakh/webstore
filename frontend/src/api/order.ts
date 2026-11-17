
export interface ShippingOption {
    id: number;
    name: string;
    description: string;
    price: string;
    delivery_time: string;
}

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


export async function createOrder(data: CreateOrderInput) {
    const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Could not create order");
    }

    return result;
}

export async function getUserOrders() {
    const response = await fetch("http://localhost:3000/api/orders", {
        method: "GET",
        credentials: "include"
    });

    const data = await response.json();

    console.log("ORDERS RESPONSE:", data);

    if (!response.ok) {
        throw new Error(data.message || "Could not retrieve orders");
    }

    return data.orders;
}