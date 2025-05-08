import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "@/app/api/api"

// Types
export interface Transaction {
  _id: string
  buyer: string
  seller: string
  product?: string
  shopName?: string
  amount: number
  phone: string
  merchantRequestID?: string
  checkoutRequestID?: string
  mpesaReceiptNumber?: string
  transactionDate?: string
  status: "pending" | "completed" | "failed"
  resultCode?: number
  resultDesc?: string
  type?: "payment" | "withdrawal"
  createdAt: string
  updatedAt: string
}

interface PaymentState {
  loading: boolean
  error: string | null
  success: string | null
  transactions: Transaction[]
  currentTransaction: Transaction | null
  walletBalance: number
}

// Initial state
const initialState: PaymentState = {
  loading: false,
  error: null,
  success: null,
  transactions: [],
  currentTransaction: null,
  walletBalance: 0,
}

// Async thunks
export const initiateSTKPush = createAsyncThunk(
  "payment/initiateSTKPush",
  async (
    paymentData: {
      phone: string
      amount: number
      sellerId: string
      productId: string
      shopName: string
      buyerId: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/pay/stkpush", paymentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to initiate payment")
    }
  },
)

export const checkPaymentStatus = createAsyncThunk(
  "payment/checkPaymentStatus",
  async (checkoutRequestID: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/pay/check-status", { checkoutRequestID })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to check payment status")
    }
  },
)

// New thunk for querying transaction status directly from M-Pesa
export const queryTransactionStatus = createAsyncThunk(
  "payment/queryTransactionStatus",
  async (params: { transactionId?: string; checkoutRequestID?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/pay/transaction-status", params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to query transaction status")
    }
  },
)

export const withdrawFunds = createAsyncThunk(
  "payment/withdrawFunds",
  async (withdrawData: { amount: number; phone: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/wallet/withdraw", withdrawData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to withdraw funds")
    }
  },
)

export const fetchTransactions = createAsyncThunk("payment/fetchTransactions", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/transactions")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch transactions")
  }
})

export const fetchWalletBalance = createAsyncThunk("payment/fetchWalletBalance", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/wallet/balance")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch wallet balance")
  }
})

// Slice
const paymentReducer = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.error = null
      state.success = null
    },
    setCurrentTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.currentTransaction = action.payload
    },
    resetPaymentProcess: (state) => {
      state.loading = false
      state.error = null
      state.success = null
      state.currentTransaction = null
    },
  },
  extraReducers: (builder) => {
    // Initiate STK Push
    builder.addCase(initiateSTKPush.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(initiateSTKPush.fulfilled, (state, action) => {
      state.loading = false
      state.success = "Payment initiated successfully. Please check your phone."
    })
    builder.addCase(initiateSTKPush.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Check Payment Status
    builder.addCase(checkPaymentStatus.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(checkPaymentStatus.fulfilled, (state, action) => {
      state.loading = false

      // Only update if we have valid data
      if (action.payload && action.payload.data) {
        state.currentTransaction = action.payload.data

        if (action.payload.data.status === "completed") {
          state.success = "Payment completed successfully!"
        } else if (action.payload.data.status === "failed") {
          state.error = "Payment failed. Please try again."
        }
        // For pending status, we don't set any message as we're still waiting
      }
    })
    builder.addCase(checkPaymentStatus.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Query Transaction Status
    builder.addCase(queryTransactionStatus.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(queryTransactionStatus.fulfilled, (state, action) => {
      state.loading = false

      // Handle the response from the M-Pesa Transaction Status API
      if (action.payload && action.payload.data) {
        state.currentTransaction = action.payload.data

        if (action.payload.data.status === "completed") {
          state.success = "Payment completed successfully!"
        } else if (action.payload.data.status === "failed") {
          state.error = "Payment failed. Please try again."
        }
      }
    })
    builder.addCase(queryTransactionStatus.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Withdraw Funds
    builder.addCase(withdrawFunds.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(withdrawFunds.fulfilled, (state, action) => {
      state.loading = false
      state.success = "Withdrawal request sent successfully. Please wait for processing."
    })
    builder.addCase(withdrawFunds.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.transactions = action.payload.data
    })
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Wallet Balance
    builder.addCase(fetchWalletBalance.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchWalletBalance.fulfilled, (state, action) => {
      state.loading = false
      state.walletBalance = action.payload.data.balance
    })
    builder.addCase(fetchWalletBalance.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { clearPaymentState, setCurrentTransaction, resetPaymentProcess } = paymentReducer.actions
export default paymentReducer.reducer
