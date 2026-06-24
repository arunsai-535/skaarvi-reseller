import { createSlice } from '@reduxjs/toolkit';

// Helper function to calculate totals
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Shipping calculation (can be customized)
  const shipping = subtotal > 500 ? 0 : 50;
  
  const total = subtotal + shipping;
  
  return { subtotal, totalItems, shipping, total };
};

const initialState = {
  items: [], // [{ productId, name, price, quantity, image, referralCode, maxStock }]
  referralCode: null, // Global referral code from URL
  ...calculateTotals([]),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, image, stock, quantity = 1, referralCode } = action.payload;
      
      const existingItem = state.items.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update quantity if already in cart
        const newQuantity = existingItem.quantity + quantity;
        existingItem.quantity = Math.min(newQuantity, stock); // Don't exceed stock
      } else {
        // Add new item to cart
        state.items.push({
          productId,
          name,
          price,
          quantity: Math.min(quantity, stock),
          image,
          referralCode: referralCode || state.referralCode,
          maxStock: stock,
        });
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.maxStock));
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.subtotal = totals.subtotal;
        state.totalItems = totals.totalItems;
        state.shipping = totals.shipping;
        state.total = totals.total;
      }
    },
    
    setReferralCode: (state, action) => {
      state.referralCode = action.payload;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.referralCode = null;
      state.subtotal = 0;
      state.totalItems = 0;
      state.shipping = 0;
      state.total = 0;
    },
    
    // Load cart from localStorage (for guest users)
    loadCart: (state, action) => {
      const { items, referralCode } = action.payload;
      state.items = items || [];
      state.referralCode = referralCode || null;
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },
    
    // Merge guest cart with user cart on login
    mergeCart: (state, action) => {
      const guestItems = action.payload;
      
      if (!guestItems || guestItems.length === 0) return;
      
      guestItems.forEach(guestItem => {
        const existingItem = state.items.find(item => item.productId === guestItem.productId);
        
        if (existingItem) {
          // Sum quantities
          const newQuantity = existingItem.quantity + guestItem.quantity;
          existingItem.quantity = Math.min(newQuantity, guestItem.maxStock);
        } else {
          // Add guest item to cart
          state.items.push(guestItem);
        }
      });
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setReferralCode,
  clearCart,
  loadCart,
  mergeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
