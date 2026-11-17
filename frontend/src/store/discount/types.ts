
export interface Discount {
    id: number;
    name: string;
    percentage: number;
    start_date: string;
    end_date: string;
}

export interface DiscountState {
    data: Discount[];
}

export const LOAD_DISCOUNT = 'LOAD/DISCOUNT';

export interface LoadDiscountAction {
    type: typeof LOAD_DISCOUNT;
    payload: {
        data: Discount[];
    }
}

export type DiscountActions = LoadDiscountAction;
