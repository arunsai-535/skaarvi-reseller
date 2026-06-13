import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: {
    totalProducts: 0,
    activeProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalEarnings: 0,
    pendingSettlements: 0,
  },
  profile: null,
  loading: false,
  error: null,
};

const manufacturerSlice = createSlice({
  name: 'manufacturer',
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboard = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
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
  },
});

export const {
  setDashboardData,
  setProfile,
  setLoading,
  setError,
  clearError,
} = manufacturerSlice.actions;

export default manufacturerSlice.reducer;
