import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "@/app/api/api"

// Types
export interface Order {
  _id: string
  orderId: string
  customerId: string
  sellerId: string
  products: Array<{
    productId: string
    quantity: number
    price: number
    productName: string
    productImage: string
  }>
  totalAmount: number
  orderFee: number
  shippingFee: number
  deliveryAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  deliveryInstructions?: string
  expectedDeliveryDate: string
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'cancelled'
  sellerNotes?: string
  customerNotes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderState {
  loading: boolean
  error: string | null
  success: string | null
  orders: Order[]
  currentOrder: Order | null
}

// Initial state
const initialState: OrderState = {
  loading: false,
  error: null,
  success: null,
  orders: [],
  currentOrder: null,
}

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders/create", orderData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create order")
    }
  },
)

export const getCustomerOrders = createAsyncThunk(
  "order/getCustomerOrders",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/customer/${customerId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch orders")
    }
  },
)

export const getSellerOrders = createAsyncThunk(
  "order/getSellerOrders",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/seller/${sellerId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch orders")
    }
  },
)

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch order")
    }
  },
)

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, orderStatus, sellerNotes }: { orderId: string; orderStatus: string; sellerNotes?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { orderStatus, sellerNotes })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update order status")
    }
  },
)

export const calculateOrderFees = createAsyncThunk(
  "order/calculateOrderFees",
  async ({ location, totalAmount }: { location: string; totalAmount: number }, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders/calculate-fees", { location, totalAmount })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to calculate fees")
    }
  },
)

// Slice
const orderReducer = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.error = null
      state.success = null
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload
    },
    resetOrderProcess: (state) => {
      state.loading = false
      state.error = null
      state.success = null
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false
      state.success = "Order created successfully"
      state.currentOrder = action.payload.order
    })
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Get Customer Orders
    builder.addCase(getCustomerOrders.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getCustomerOrders.fulfilled, (state, action) => {
      state.loading = false
      state.orders = action.payload.orders
    })
    builder.addCase(getCustomerOrders.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Get Seller Orders
    builder.addCase(getSellerOrders.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getSellerOrders.fulfilled, (state, action) => {
      state.loading = false
      state.orders = action.payload.orders
    })
    builder.addCase(getSellerOrders.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Get Single Order
    builder.addCase(getOrder.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getOrder.fulfilled, (state, action) => {
      state.loading = false
      state.currentOrder = action.payload.order
    })
    builder.addCase(getOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Update Order Status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.loading = false
      state.success = "Order status updated successfully"
      if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
        state.currentOrder = action.payload.order
      }
    })
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Calculate Order Fees
    builder.addCase(calculateOrderFees.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(calculateOrderFees.fulfilled, (state, action) => {
      state.loading = false
    })
    builder.addCase(calculateOrderFees.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { clearOrderState, setCurrentOrder, resetOrderProcess } = orderReducer.actions
export default orderReducer.reducer 