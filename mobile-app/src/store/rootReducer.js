import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import providerReducer from '../redux/providers/providerSlice';
import progressReducer from '../redux/progress/progressSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  providers: providerReducer,
  progress: progressReducer,
});

export default rootReducer;
