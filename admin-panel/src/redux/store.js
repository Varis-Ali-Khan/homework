import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import usersReducer from './users/usersSlice';
import providersReducer from './providers/providersSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    providers: providersReducer,
  },
});
