import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/api';

interface Product {
  _id: string;
  // Add more product properties as needed
}

interface WishlistProduct {
  _id: string;
  // Add more wishlist product properties as needed
}

interface CardState {
  card_products: Product[];
  card_product_count: number;
  buy_product_item: number;
  wishlist_count: number;
  wishlist: WishlistProduct[];
  price: number;
  errorMessage: string;
  successMessage: string;
  shipping_fee: number;
  outofstock_products: Product[];
}

interface ApiResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

const initialState: CardState = {
  card_products: [],
  card_product_count: 0,
  buy_product_item: 0,
  wishlist_count: 0,
  wishlist: [],
  price: 0,
  errorMessage: '',
  successMessage: '',
  shipping_fee: 0,
  outofstock_products: []
};

// Thunks

export const add_to_card = createAsyncThunk<ApiResponse, any>(
  'card/add_to_card',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/home/product/add-to-card', info);
      return fulfillWithValue(data);
    } catch (error: any) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_card_products = createAsyncThunk<ApiResponse, string>(
  'card/get_card_products',
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/home/product/get-card-product/${userId}`);
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const delete_card_product = createAsyncThunk<ApiResponse, string>(
  'card/delete_card_product',
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/home/product/delete-card-product/${card_id}`);
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const quantity_inc = createAsyncThunk<ApiResponse, string>(
  'card/quantity_inc',
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/home/product/quantity-inc/${card_id}`);
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const quantity_dec = createAsyncThunk<ApiResponse, string>(
  'card/quantity_dec',
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/home/product/quantity-dec/${card_id}`);
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const add_to_wishlist = createAsyncThunk<ApiResponse, any>(
  'wishlist/add_to_wishlist',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/home/product/add-to-wishlist', info);
      console.log(data);
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_wishlist_products = createAsyncThunk<ApiResponse, string>(
  'wishlist/get_wishlist_products',
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/home/product/get-wishlist-products/${userId}`);
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const remove_wishlist = createAsyncThunk<ApiResponse, string>(
  'wishlist/remove_wishlist',
  async (wishlistId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/home/product/delete-wishlist-product/${wishlistId}`);
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice

export const cardReducer = createSlice({
  name: 'card',
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    },
    reset_count: (state) => {
      state.card_product_count = 0;
      state.wishlist_count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_to_card.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.successMessage = action.payload.message ?? '';
        state.card_product_count += 1;
      })
      .addCase(add_to_card.rejected, (state, action: PayloadAction<any>) => {
        state.errorMessage = action.payload?.error ?? 'Something went wrong';
      })
      .addCase(get_card_products.fulfilled, (state, action: PayloadAction<any>) => {
        state.card_products = action.payload.card_products || [];
        state.price = action.payload.price || 0;
        state.card_product_count = action.payload.card_product_count || 0;
        state.shipping_fee = action.payload.shipping_fee || 0;
        state.outofstock_products = action.payload.outOfStockProduct || [];
        state.buy_product_item = action.payload.buy_product_item || 0;
      })
      .addCase(delete_card_product.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.successMessage = action.payload.message ?? '';
      })
      .addCase(quantity_inc.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.successMessage = action.payload.message ?? '';
      })
      .addCase(quantity_dec.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.successMessage = action.payload.message ?? '';
      })
      .addCase(add_to_wishlist.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.successMessage = action.payload.message ?? '';
        state.wishlist_count = state.wishlist_count > 0 ? state.wishlist_count + 1 : 1;
      })
      .addCase(add_to_wishlist.rejected, (state, action: PayloadAction<any>) => {
        state.errorMessage = action.payload?.error ?? 'Something went wrong';
      })
      .addCase(get_wishlist_products.fulfilled, (state, action: PayloadAction<any>) => {
        state.wishlist = action.payload.wishlists || [];
        state.wishlist_count = action.payload.wishlistCount || 0;
      })
      .addCase(remove_wishlist.fulfilled, (state, action: PayloadAction<any>) => {
        state.successMessage = action.payload.message ?? '';
        state.wishlist = state.wishlist.filter(p => p._id !== action.payload.wishlistId);
        state.wishlist_count -= 1;
      });
  }
});

export const { messageClear, reset_count } = cardReducer.actions;
export default cardReducer.reducer;
