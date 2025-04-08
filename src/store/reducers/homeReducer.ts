import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/app/api/api'

// -----------------------------
// Interfaces
// -----------------------------
interface Category {
    _id: string
    name: string
    [key: string]: any
}

interface Product {
    _id: string
    name: string
    price: number
    rating: number
    category: string
    [key: string]: any
}

interface PriceRange {
    low: number
    high: number
}

interface Review {
    _id: string
    rating: number
    comment: string
    [key: string]: any
}

interface Banner {
    _id: string
    image: string
    link: string
    [key: string]: any
}

interface QueryParams {
    category: string
    rating: number
    low: number
    high: number
    sortPrice: string
    pageNumber: number
    searchValue?: string
}

interface ReviewParams {
    productId: string
    pageNumber: number
}

interface HomeState {
    categories: Category[]
    products: Product[]
    totalProduct: number
    parPage: number
    latest_product: Product[]
    topRated_product: Product[]
    discount_product: Product[]
    priceRange: PriceRange
    product: Product | {}
    relatedProducts: Product[]
    moreProducts: Product[]
    successMessage: string
    errorMessage: string
    totalReview: number
    rating_review: any[]
    reviews: Review[]
    banners: Banner[]
}

// -----------------------------
// Initial State
// -----------------------------
const initialState: HomeState = {
    categories: [],
    products: [],
    totalProduct: 0,
    parPage: 4,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: {
        low: 0,
        high: 100
    },
    product: {},
    relatedProducts: [],
    moreProducts: [],
    successMessage: '',
    errorMessage: '',
    totalReview: 0,
    rating_review: [],
    reviews: [],
    banners: []
}

// -----------------------------
// Async Thunks
// -----------------------------
export const get_category = createAsyncThunk(
    'product/get_category',
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/get-categorys')
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

export const get_products = createAsyncThunk(
    'product/get_products',
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/get-products')
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

export const get_product = createAsyncThunk(
    'product/get_product',
    async (slug: string, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/get-product/${slug}`)
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/price-range-latest-product')
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

export const get_banners = createAsyncThunk(
    'product/get_banners',
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/banners')
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

export const query_products = createAsyncThunk(
    'product/query_products',
    async (query: QueryParams, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}&&searchValue=${query.searchValue ?? ''}`
            )
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

export const customer_review = createAsyncThunk(
    'review/customer_review',
    async (info: any, { fulfillWithValue }) => {
        try {
            const { data } = await api.post('/home/customer/submit-review', info)
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async ({ productId, pageNumber }: ReviewParams, { fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`)
            return fulfillWithValue(data)
        } catch (error: any) {
            console.error(error.response)
        }
    }
)

// -----------------------------
// Slice
// -----------------------------
export const homeReducer = createSlice({
    name: 'home',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.successMessage = ""
            state.errorMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_category.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.categories = payload?.categories || []
            })
            .addCase(get_products.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.products = payload?.products || []
                state.latest_product = payload?.latest_product || []
                state.topRated_product = payload?.topRated_product || []
                state.discount_product = payload?.discount_product || []
            })
            .addCase(get_product.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.product = payload?.product || {}
                state.relatedProducts = payload?.relatedProducts || []
                state.moreProducts = payload?.moreProducts || []
            })
            .addCase(price_range_product.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.latest_product = payload?.latest_product || []
                state.priceRange = payload?.priceRange || { low: 0, high: 100 }
            })
            .addCase(query_products.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.products = payload?.products || []
                state.totalProduct = payload?.totalProduct || 0
                state.parPage = payload?.parPage || 4
            })
            .addCase(customer_review.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.successMessage = payload?.message || ''
            })
            .addCase(get_reviews.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.reviews = payload?.reviews || []
                state.totalReview = payload?.totalReview || 0
                state.rating_review = payload?.rating_review || []
            })
            .addCase(get_banners.fulfilled, (state, { payload }: PayloadAction<any>) => {
                state.banners = payload?.banners || []
            })
    }
})

// -----------------------------
// Exports
// -----------------------------
export const { messageClear } = homeReducer.actions
export default homeReducer.reducer
