import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  error: null,
  setupLoading: false,
  setupError: null,
};

const providerSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    fetchProvidersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProvidersSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchProvidersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setupProfileRequest: (state) => {
      state.setupLoading = true;
      state.setupError = null;
    },
    setupProfileSuccess: (state) => {
      state.setupLoading = false;
    },
    setupProfileFailure: (state, action) => {
      state.setupLoading = false;
      state.setupError = action.payload;
    },
  },
});

export const {
  fetchProvidersRequest,
  fetchProvidersSuccess,
  fetchProvidersFailure,
  setupProfileRequest,
  setupProfileSuccess,
  setupProfileFailure,
} = providerSlice.actions;

export default providerSlice.reducer;
