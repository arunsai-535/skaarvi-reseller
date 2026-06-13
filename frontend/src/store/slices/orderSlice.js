import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  filters: {
    status: 'all',
    paymentStatus: 'all',
    search: '',
    dateFrom: null,
    dateTo: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
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
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.orders.findIndex(o => o.id === id);
      if (index !== -1) {
        state.orders[index].status = status;
      }
      if (state.currentOrder?.id === id) {
        state.currentOrder.status = status;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  updateOrder,
  updateOrderStatus,
  setFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
  clearFilters,
} = orderSlice.actions;

export default orderSlice.reducer;

// Selectors
export const selectOrders = (state) => state.order.orders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderFilters = (state) => state.order.filters;
export const selectOrderPagination = (state) => state.order.pagination;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
