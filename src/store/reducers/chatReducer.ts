import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/app/api/api'

// Define types
interface Friend {
  fdId: string
  [key: string]: any
}

interface Message {
  senderId: string
  receverId: string
  content: string
  timestamp?: string
  [key: string]: any
}

interface AddFriendResponse {
  messages: Message[]
  currentFd: string
  myFriends: Friend[]
}

interface SendMessageResponse {
  message: Message
}

interface ChatState {
  my_friends: Friend[]
  fd_messages: Message[]
  currentFd: string
  successMessage: string
  errorMessage: string
}

// Async Thunks
export const add_friend = createAsyncThunk<
  AddFriendResponse,
  Record<string, any>,
  { rejectValue: any }
>('chat/add_friend', async (info, { fulfillWithValue, rejectWithValue }) => {
  try {
    const { data } = await api.post('/chat/customer/add-customer-friend', info)
    console.log(data)
    return fulfillWithValue(data)
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { error: 'Unknown error' })
  }
})

export const send_message = createAsyncThunk<
  SendMessageResponse,
  Record<string, any>,
  { rejectValue: any }
>('chat/send_message', async (info, { fulfillWithValue, rejectWithValue }) => {
  try {
    const { data } = await api.post('/chat/customer/send-message-to-seller', info)
    console.log(data)
    return fulfillWithValue(data)
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { error: 'Unknown error' })
  }
})

// Initial state
const initialState: ChatState = {
  my_friends: [],
  fd_messages: [],
  currentFd: '',
  successMessage: '',
  errorMessage: ''
}

// Slice
export const chatReducer = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
      state.successMessage = ''
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      state.fd_messages = [...state.fd_messages, action.payload]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(add_friend.fulfilled, (state, action) => {
      state.fd_messages = action.payload.messages
      state.currentFd = action.payload.currentFd
      state.my_friends = action.payload.myFriends
    })
    builder.addCase(send_message.fulfilled, (state, action) => {
      const tempFriends = [...state.my_friends]
      const index = tempFriends.findIndex(f => f.fdId === action.payload.message.receverId)

      // Move friend to the top of the list if found
      if (index > 0) {
        const [friend] = tempFriends.splice(index, 1)
        tempFriends.unshift(friend)
      }

      state.my_friends = tempFriends
      state.fd_messages = [...state.fd_messages, action.payload.message]
      state.successMessage = 'message send success'
    })
  }
})

export const { messageClear, updateMessage } = chatReducer.actions
export default chatReducer.reducer
