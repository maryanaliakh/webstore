import {
    LOAD_PRODUCT,
    LOAD_PRODUCT_DETAILS,
    LOAD_PRODUCT_FILTER_OPTIONS,
    TOGGLE_PRODUCTS_FAVORITE,
    ProductActions,
    ProductDetails,
    ProductFilterOptionsState,
    ProductState,
    ProductFavorites, LOAD_MODAL_PRODUCT_DETAILS
} from './types.ts'

const initialProductState: ProductState = {
  data: [],
}

const initialProductFilterOptionsState: ProductFilterOptionsState = {
    all: {
        minPrice: 0,
        maxPrice: 500,
        colors: [],
        sizes: [],
        categories: [],
        subcategories: [],
        materials: [],
        origins: [],
        discounts: [],
        collections: []
    },
    filtered: {
        minPrice: 0,
        maxPrice: 500,
        colors: [],
        sizes: [],
        categories: [],
        subcategories: [],
        materials: [],
        origins: [],
        discounts: [],
        collections: []
    }
};

const initialProductDetailsState: ProductDetails = {
    id: undefined,
    name: null,
    subtitle: null,
    price: null,
    description: null,
    material: null,
    care: null,
    origin: null,
    category: null,
    subcategory: null,

    colors: [],
    selectedColor: null,

    variants: [],

    images: [],

    gender: null,

    shipOptions: [],
    returnOptions: [],
    returnPolicy: []
};

const initialProductFavorites: ProductFavorites = {
    ids: JSON.parse(localStorage.getItem("favorites") || "[]")
}

export const productReducer = (state = initialProductState, action: ProductActions) => {
    switch (action.type) {
        case LOAD_PRODUCT: {
            return {
                ...state,
                data: action.payload.data
            }
        }
        default: {
            return state
        }
    }
}

export const productFilterOptionsReducer = (state = initialProductFilterOptionsState, action: ProductActions) => {
    switch (action.type) {
        case LOAD_PRODUCT_FILTER_OPTIONS: {
            return {
                ...state,
                [action.payload.target]: action.payload.data
            };
        }
        default: {
            return state;
        }
    }
};

export const productDetailsReducer = (state = initialProductDetailsState, action: ProductActions) => {
    switch (action.type) {
        case LOAD_PRODUCT_DETAILS: {
            return {
                ...state,
                id: action.payload.data.id,
                name: action.payload.data.name,
                subtitle: action.payload.data.subtitle,
                price: action.payload.data.price,
                description: action.payload.data.description,
                material: action.payload.data.material,
                care: action.payload.data.care,
                origin: action.payload.data.origin,
                category: action.payload.data.category,
                subcategory: action.payload.data.subcategory,

                colors: action.payload.data.colors,
                selectedColor: action.payload.data.selectedColor,

                variants: action.payload.data.variants,
                images: action.payload.data.images,

                gender: action.payload.data.gender,

                shipOptions: action.payload.data.shipOptions,
                returnOptions: action.payload.data.returnOptions,
                returnPolicy: action.payload.data.returnPolicy,
            };
        }

        default: {
            return state;
        }
    }
};

export const productFavoritesReducer = (state = initialProductFavorites, action: ProductActions): ProductFavorites => {
    switch (action.type) {
        case TOGGLE_PRODUCTS_FAVORITE: {
            const productId = action.payload.data

            const ids = state.ids.includes(productId)
                ? state.ids.filter(id => id !== productId)
                : [...state.ids, productId]

            localStorage.setItem("favorites", JSON.stringify(ids))

            return {...state, ids}
        }
        default:
            return state
    }
}

export const modalProductDetailsReducer = (state = initialProductDetailsState, action: ProductActions) => {
    switch (action.type) {
        case LOAD_MODAL_PRODUCT_DETAILS:
            return action.payload.data;
        default:
            return state;
    }
};