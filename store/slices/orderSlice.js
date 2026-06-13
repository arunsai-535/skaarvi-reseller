import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  filters: {
    status: 'all',
    search: '',
  },
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  updateOrder,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer;
