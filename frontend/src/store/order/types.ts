
export type OrderItem = {
    id: number;
    order_id: number;
    variant_id: number | null;
    product_name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image_url: string | null;
};

export type Payment = {
    id: number;
    method: string;
    status: string;
    transaction_id: string;
};

export interface Order {
    id: number;
    created_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_method: string;
    shipping_country: string | null;
    shipping_city: string | null;
    shipping_postal_code: string | null;
    shipping_street: string | null;
    shipping_building: string | null;
    shipping_apartment: string | null;
    pickup_point_name: string | null;
    store_name: string | null;
    shipping_price: string;
    payment_method: string;
    subtotal: string;
    total: string;
    status: string;
    order_items: OrderItem[];
    payments: Payment[];
}

export interface OrdersState {
    data: Order[];
    loading: boolean;
    error: string | null;
}

export const LOAD_ORDERS = "ORDERS/LOAD";
export const ORDERS_LOADING = "ORDERS/LOADING";
export const ORDERS_ERROR = "ORDERS/ERROR";

export interface LoadOrdersAction {
    type: typeof LOAD_ORDERS;
    payload: { data: Order[] };
}

export interface OrdersLoadingAction {
    type: typeof ORDERS_LOADING;
}

export interface OrdersErrorAction {
    type: typeof ORDERS_ERROR;
    payload: { error: string };
}

export type OrdersActions =
    | LoadOrdersAction
    | OrdersLoadingAction
    | OrdersErrorAction;
