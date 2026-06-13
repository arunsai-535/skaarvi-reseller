import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  currentProduct: null,
  filters: {
    status: 'all',
    category: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
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
  setProducts,
  setCurrentProduct,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
