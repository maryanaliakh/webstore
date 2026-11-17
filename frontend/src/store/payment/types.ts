export interface PaymentMethod {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    display_order: number;
}

export interface PaymentState {
    data: PaymentMethod[];
}

export const LOAD_PAYMENT = "PAYMENT/LOAD";

export interface LoadPaymentAction {
    type: typeof LOAD_PAYMENT;
    payload: {
        data: PaymentMethod[];
    };
}

export type PaymentActions = LoadPaymentAction;