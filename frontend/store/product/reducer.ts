import {DELETE_PRODUCTS, LOAD_PRODUCTS, ProductsActions, ProductState} from './types'

const initialState: ProductState = {
  data: [],
}

export const productReducer = (state = initialState, action: ProductsActions) => {
    switch (action.type) {
        case LOAD_PRODUCTS: {
            return {
                ...state,
                data: action.payload.data
            }
        }
        case DELETE_PRODUCTS: {
            return {
                ...state,
                data: state.data.filter(product=> product.id !== action.payload.id)
            }
        }
        default: {
            return state
        }
    }
}