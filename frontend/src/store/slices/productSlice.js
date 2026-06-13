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
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
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
  setProducts,
  setCurrentProduct,
  addProduct,
  updateProduct,
  removeProduct,
  setFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;

// Selectors
export const selectProducts = (state) => state.product.products;
export const selectCurrentProduct = (state) => state.product.currentProduct;
export const selectProductFilters = (state) => state.product.filters;
export const selectProductPagination = (state) => state.product.pagination;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
