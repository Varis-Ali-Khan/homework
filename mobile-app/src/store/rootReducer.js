import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import providerReducer from '../features/providers/providerSlice';
import progressReducer from '../features/progress/progressSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  providers: providerReducer,
  progress: progressReducer,
});

export default rootReducer;
