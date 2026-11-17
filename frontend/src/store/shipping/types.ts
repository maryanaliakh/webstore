export interface ShippingOption {
    id: number;
    name: string;
    description: string | null;
    price: string;
    delivery_time: string;
}

export interface ShippingState {
    data: ShippingOption[];
}

export const LOAD_SHIPPING = "SHIPPING/LOAD";

export interface LoadShippingAction {
    type: typeof LOAD_SHIPPING;
    payload: {
        data: ShippingOption[];
    };
}

export type ShippingActions = LoadShippingAction;