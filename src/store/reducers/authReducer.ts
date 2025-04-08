import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/app/api/api'
import { jwtDecode } from 'jwt-decode';

interface AuthInfo {
    email: string
    password: string
    name?: string // name is optional (used in register)
}

interface JwtPayload {
    id: string
    email: string
    name: string
    iat?: number
    exp?: number
    [key: string]: any // to accommodate any additional fields
}

interface AuthResponse {
    message: string
    token: string
}

interface AuthState {
    loader: boolean
    userInfo: JwtPayload | string
    errorMessage: string
    successMessage: string
}

// Async Thunks
export const customer_register = createAsyncThunk<
    AuthResponse, // return type
    AuthInfo, // argument type
    { rejectValue: { error: string } }
>(
    'auth/customer_register',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponse>('/customer/customer-register', info)
            localStorage.setItem('customerToken', data.token)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const customer_login = createAsyncThunk<
    AuthResponse,
    AuthInfo,
    { rejectValue: { error: string } }
>(
    'auth/customer_login',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponse>('/customer/customer-login', info)
            localStorage.setItem('customerToken', data.token)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response.data)
        }
    }
)

// Decode token utility
const decodeToken = (token: string | null): JwtPayload | string => {
    if (token) {
        return jwtDecode<JwtPayload>(token)
    }
    return ''
}

// Initial State
const getTokenFromLocalStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('customerToken')
    }
    return null
}

const initialState: AuthState = {
    loader: false,
    userInfo: decodeToken(getTokenFromLocalStorage()),
    errorMessage: '',
    successMessage: ''
}


// Slice
export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ''
            state.successMessage = ''
        },
        user_reset: (state) => {
            state.userInfo = ''
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(customer_register.pending, (state) => {
                state.loader = true
            })
            .addCase(customer_register.rejected, (state, action) => {
                state.loader = false
                state.errorMessage = action.payload?.error || 'Registration failed'
            })
            .addCase(customer_register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loader = false
                state.successMessage = action.payload.message
                state.userInfo = decodeToken(action.payload.token)
            })
            // Login
            .addCase(customer_login.pending, (state) => {
                state.loader = true
            })
            .addCase(customer_login.rejected, (state, action) => {
                state.loader = false
                state.errorMessage = action.payload?.error || 'Login failed'
            })
            .addCase(customer_login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loader = false
                state.successMessage = action.payload.message
                state.userInfo = decodeToken(action.payload.token)
            })
    }
})

// Export actions and reducer
export const { messageClear, user_reset } = authReducer.actions
export default authReducer.reducer
